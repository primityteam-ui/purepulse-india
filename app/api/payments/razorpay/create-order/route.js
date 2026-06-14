import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.'
        },
        { status: 500 }
      )
    }

    await connectDB()

    const body = await request.json()
    const orderId = body.orderId

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID is required.'
        },
        { status: 400 }
      )
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found.'
        },
        { status: 404 }
      )
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    })

    const amountINR = Number(body.amountINR || order.totalPaid || order.totalUSD || 0)

    if (!amountINR || amountINR <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid payment amount is required.'
        },
        { status: 400 }
      )
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountINR * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        appOrderId: String(order._id),
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail
      }
    })

    order.paymentMethod = 'razorpay'
    order.paymentStatus = 'pending'
    order.paymentIntentId = razorpayOrder.id
    order.currencyPaid = 'INR'
    order.totalPaid = amountINR
    await order.save()

    return NextResponse.json({
      success: true,
      keyId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone
    })
  } catch (error) {
    console.error('Razorpay create order error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Could not create Razorpay order.'
      },
      { status: 500 }
    )
  }
}

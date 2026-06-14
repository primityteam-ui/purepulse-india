import crypto from 'crypto'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay secret is not configured.'
        },
        { status: 500 }
      )
    }

    const {
      appOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Razorpay payment verification details.'
        },
        { status: 400 }
      )
    }

    const hmac = crypto.createHmac('sha256', keySecret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const expectedSignature = hmac.digest('hex')

    const verified = expectedSignature === razorpay_signature

    if (!verified) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Payment verification failed.'
        },
        { status: 400 }
      )
    }

    await connectDB()

    const query = appOrderId
      ? { _id: appOrderId }
      : { paymentIntentId: razorpay_order_id }

    const order = await Order.findOneAndUpdate(
      query,
      {
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paymentMethod: 'razorpay',
        paymentIntentId: razorpay_payment_id
      },
      { new: true }
    )

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          verified: true,
          error: 'Payment verified, but order was not found.'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      order
    })
  } catch (error) {
    console.error('Razorpay verify error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Razorpay verification failed.'
      },
      { status: 500 }
    )
  }
}

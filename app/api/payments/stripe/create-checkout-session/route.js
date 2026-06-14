import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

function getBaseUrl(request) {
  const origin = request.headers.get('origin')
  if (origin) return origin
  return process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
}

export async function POST(request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel.'
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

    const stripe = new Stripe(stripeSecretKey)
    const baseUrl = getBaseUrl(request)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: order.customerEmail,
      line_items: order.items.map((item) => ({
        quantity: Number(item.quantity || 1),
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.productName} - ${item.variant}`
          },
          unit_amount: Math.round(Number(item.priceUSD || 0) * 100)
        }
      })),
      metadata: {
        orderId: String(order._id),
        orderNumber: order.orderNumber
      },
      success_url: `${baseUrl}/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&paid=success`,
      cancel_url: `${baseUrl}/checkout?cancelled=true`
    })

    order.paymentMethod = 'stripe'
    order.paymentStatus = 'pending'
    order.paymentIntentId = session.id
    await order.save()

    return NextResponse.json({
      success: true,
      url: session.url
    })
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Could not create Stripe checkout session.'
      },
      { status: 500 }
    )
  }
}

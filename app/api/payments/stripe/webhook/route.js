import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stripe webhook is not configured.'
        },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      await connectDB()

      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          paymentMethod: 'stripe',
          paymentIntentId: session.payment_intent || session.id,
          totalPaid: Number(session.amount_total || 0) / 100,
          currencyPaid: String(session.currency || 'usd').toUpperCase()
        })
      }
    }

    return NextResponse.json({
      received: true
    })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Stripe webhook failed.'
      },
      { status: 400 }
    )
  }
}

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    if (orderNumber && email) {
      const order = await Order.findOne({
        orderNumber,
        customerEmail: email
      }).lean()

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        order
      })
    }

    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders', orders: [] },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Customer name and email are required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      )
    }

    const subtotalUSD = Number(
      body.subtotalUSD ||
        body.items.reduce((total, item) => total + Number(item.priceUSD || 0) * Number(item.quantity || 0), 0)
    )

    const discountPercent = Number(body.discountPercent || 0)
    const discountAmountUSD = Number(body.discountAmountUSD || 0)
    const totalUSD = Number(body.totalUSD || subtotalUSD - discountAmountUSD)

    const order = await Order.create({
      ...body,
      subtotalUSD,
      discountPercent,
      discountAmountUSD,
      totalUSD,
      totalPaid: Number(body.totalPaid || totalUSD),
      currencyPaid: body.currencyPaid || 'USD',
      paymentStatus: body.paymentStatus || 'pending',
      orderStatus: body.orderStatus || 'processing'
    })

    return NextResponse.json(
      { success: true, order },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

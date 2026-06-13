import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const order = await Order.findById(params.id).lean()

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
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()

    const allowedUpdates = {
      paymentStatus: body.paymentStatus,
      orderStatus: body.orderStatus,
      trackingNumber: body.trackingNumber,
      shippingCarrier: body.shippingCarrier,
      notes: body.notes
    }

    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key]
      }
    })

    const order = await Order.findByIdAndUpdate(
      params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )

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
  } catch (error) {
    console.error('PUT /api/orders/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

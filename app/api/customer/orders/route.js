import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please login to view your orders.'
        },
        { status: 401 }
      )
    }

    await connectDB()

    const orders = await Order.find({
      customerEmail: session.user.email
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      orders
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Could not load customer orders.',
        orders: []
      },
      { status: 500 }
    )
  }
}

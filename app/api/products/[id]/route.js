import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id).lean()

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()

    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted'
    })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

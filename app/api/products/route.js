import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    const query = {}

    if (featured === 'true') {
      query.featured = true
    }

    if (category) {
      query.category = category
    }

    const products = await Product.find(query).sort({ featured: -1, createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products', products: [] },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const product = await Product.create(body)

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

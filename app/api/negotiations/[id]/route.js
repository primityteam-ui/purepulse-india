import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const negotiation = await Negotiation.findById(params.id).lean()

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'Negotiation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      negotiation
    })
  } catch (error) {
    console.error('GET /api/negotiations/[id] error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch negotiation' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()

    const allowedUpdates = {
      status: body.status,
      adminNotes: body.adminNotes,
      finalAgreedPriceUSD:
        body.finalAgreedPriceUSD === '' || body.finalAgreedPriceUSD === null || body.finalAgreedPriceUSD === undefined
          ? undefined
          : Number(body.finalAgreedPriceUSD)
    }

    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key]
      }
    })

    const negotiation = await Negotiation.findByIdAndUpdate(
      params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'Negotiation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      negotiation
    })
  } catch (error) {
    console.error('PUT /api/negotiations/[id] error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update negotiation' },
      { status: 500 }
    )
  }
}

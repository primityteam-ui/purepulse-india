import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'

async function getOrCreateSettings() {
  let settings = await Settings.findOne({})

  if (!settings) {
    settings = await Settings.create({})
  }

  return settings
}

export async function GET() {
  try {
    await connectDB()

    const settings = await getOrCreateSettings()

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('GET /api/settings error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch settings'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const body = await request.json()
    const existing = await getOrCreateSettings()

    const allowedFields = [
      'saleBannerEnabled',
      'saleBannerText',
      'bulkDiscountEnabled',
      'bulkDiscountMinKg',
      'bulkDiscountPercent',
      'whatsappNumber',
      'businessEmail',
      'minimumNegotiationKg',
      'stripeEnabled',
      'razorpayEnabled',
      'maintenanceMode'
    ]

    const update = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field]
      }
    }

    const settings = await Settings.findByIdAndUpdate(
      existing._id,
      update,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('PUT /api/settings error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update settings'
      },
      { status: 500 }
    )
  }
}

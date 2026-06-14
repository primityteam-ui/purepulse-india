import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'

const allowedStatuses = [
  'pending',
  'accepted',
  'rejected',
  'converted_to_order',
  'counter',
  'minimum_not_met'
]

export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()
    const negotiationId = params.id

    const update = {}

    if (body.status && allowedStatuses.includes(body.status)) {
      update.status = body.status
    }

    if (body.finalAgreedPriceUSD === '' || body.finalAgreedPriceUSD === null || body.finalAgreedPriceUSD === undefined) {
      update.finalAgreedPriceUSD = null
    } else {
      const finalPrice = Number(body.finalAgreedPriceUSD)

      if (Number.isNaN(finalPrice) || finalPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please enter a valid final agreed price.'
          },
          { status: 400 }
        )
      }

      update.finalAgreedPriceUSD = finalPrice
    }

    update.adminReply = body.adminReply || ''
    update.adminNotes = body.adminNotes || ''

    const negotiation = await Negotiation.findById(negotiationId)

    if (!negotiation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Negotiation not found.'
        },
        { status: 404 }
      )
    }

    const existingReply = negotiation.adminReply || ''
    const newReply = update.adminReply || ''

    negotiation.status = update.status || negotiation.status
    negotiation.finalAgreedPriceUSD = update.finalAgreedPriceUSD
    negotiation.adminReply = update.adminReply
    negotiation.adminNotes = update.adminNotes

    if (newReply.trim() && newReply.trim() !== existingReply.trim()) {
      negotiation.chatHistory.push({
        sender: 'admin',
        message: newReply.trim(),
        timestamp: new Date()
      })
    }

    await negotiation.save()

    return NextResponse.json({
      success: true,
      message: 'Negotiation response saved successfully.',
      negotiation
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to save negotiation response.'
      },
      { status: 500 }
    )
  }
}

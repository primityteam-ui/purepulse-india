import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'
import { sendNegotiationEmail } from '@/lib/sendNegotiationEmail'

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

    let finalAgreedPriceUSD = null

    if (
      body.finalAgreedPriceUSD !== '' &&
      body.finalAgreedPriceUSD !== null &&
      body.finalAgreedPriceUSD !== undefined
    ) {
      const finalPrice = Number(body.finalAgreedPriceUSD)

      if (Number.isNaN(finalPrice) || finalPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please enter a valid final or counter price.'
          },
          { status: 400 }
        )
      }

      finalAgreedPriceUSD = finalPrice
    }

    const nextStatus =
      body.status && allowedStatuses.includes(body.status)
        ? body.status
        : negotiation.status

    const existingReply = negotiation.adminReply || ''
    const newReply = body.adminReply || ''

    negotiation.status = nextStatus
    negotiation.finalAgreedPriceUSD = finalAgreedPriceUSD
    negotiation.adminReply = newReply
    negotiation.adminNotes = body.adminNotes || ''

    const shouldAddHistory =
      newReply.trim() && newReply.trim() !== existingReply.trim()

    if (shouldAddHistory) {
      negotiation.chatHistory.push({
        sender: 'admin',
        message: newReply.trim(),
        timestamp: new Date()
      })
    }

    await negotiation.save()

    let emailResult = {
      sent: false,
      reason: 'No new admin response was added.'
    }

    if (shouldAddHistory) {
      emailResult = await sendNegotiationEmail({
        to: negotiation.customerEmail,
        customerName: negotiation.customerName,
        productName: negotiation.productName,
        quantityKg: negotiation.quantityKg,
        status: negotiation.status,
        finalAgreedPriceUSD: negotiation.finalAgreedPriceUSD,
        adminReply: newReply.trim()
      })
    }

    return NextResponse.json({
      success: true,
      message: emailResult.sent
        ? 'Store owner response saved and customer email notification sent.'
        : `Store owner response saved. Email notification not sent: ${emailResult.reason}`,
      emailSent: emailResult.sent,
      emailReason: emailResult.reason || '',
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

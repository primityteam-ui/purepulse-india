import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'

export async function GET() {
  try {
    await connectDB()

    const negotiations = await Negotiation.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      negotiations
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        negotiations: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const quantityKg = Number(body.quantityKg)
    const offeredPriceUSD = Number(body.offeredPriceUSD || body.offeredPricePerKg)
    const listedPriceUSD = Number(body.listedPriceUSD || body.listedPricePerKg || 0)

    if (!body.productId || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product, name, and email are required.'
        },
        { status: 400 }
      )
    }

    if (!quantityKg || quantityKg <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid quantity.'
        },
        { status: 400 }
      )
    }

    if (!offeredPriceUSD || offeredPriceUSD <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid offer price.'
        },
        { status: 400 }
      )
    }

    const negotiation = await Negotiation.create({
      product: body.productId,
      productName: body.productName,
      variant: body.variant || '1kg',

      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerCountry: body.customerCountry || '',

      quantityKg,

      listedPriceUSD,
      offeredPriceUSD,
      offeredPricePerKg: offeredPriceUSD,

      status: 'pending',
      botReply: '',
      finalAgreedPrice: null,
      adminNotes: '',

      chatHistory: [
        {
          sender: 'customer',
          message: `Customer requested ${quantityKg}kg at ${offeredPriceUSD} per kg.`,
          createdAt: new Date()
        }
      ]
    })

    return NextResponse.json({
      success: true,
      message: 'Offer submitted successfully. The store owner will review and respond.',
      negotiation
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'

function generateBotReply(quantityKg, offeredPriceUSD, listedPriceUSD) {
  const ratio = offeredPriceUSD / listedPriceUSD

  if (quantityKg >= 100 && ratio >= 0.85) {
    return {
      reply: `Excellent! For ${quantityKg}kg, we accept $${offeredPriceUSD.toFixed(2)}/kg. This is our best wholesale rate. Shall we proceed?`,
      agreedPrice: offeredPriceUSD,
      status: 'accepted'
    }
  }

  if (quantityKg >= 50 && ratio >= 0.80) {
    const counter = parseFloat((offeredPriceUSD * 1.05).toFixed(2))

    return {
      reply: `Thank you! For ${quantityKg}kg our best is $${counter}/kg including export packaging. Can you meet us there?`,
      agreedPrice: counter,
      status: 'counter'
    }
  }

  if (quantityKg >= 25 && ratio >= 0.75) {
    const counter = parseFloat((listedPriceUSD * 0.85).toFixed(2))

    return {
      reply: `For ${quantityKg}kg our minimum wholesale price is $${counter}/kg with quality certificate included. Does this work?`,
      agreedPrice: counter,
      status: 'counter'
    }
  }

  if (quantityKg < 25) {
    return {
      reply: 'Our minimum for negotiation is 25kg. For smaller quantities our listed prices are our best rates. Would you like to order 25kg or more?',
      agreedPrice: null,
      status: 'minimum_not_met'
    }
  }

  const counter = parseFloat((listedPriceUSD * 0.88).toFixed(2))

  return {
    reply: `Our best price for ${quantityKg}kg is $${counter}/kg. This reflects our certified organic quality and export standards. This is our final offer.`,
    agreedPrice: counter,
    status: 'counter'
  }
}

export async function GET() {
  try {
    await connectDB()

    const negotiations = await Negotiation.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      count: negotiations.length,
      negotiations
    })
  } catch (error) {
    console.error('GET /api/negotiations error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch negotiations', negotiations: [] },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const quantityKg = Number(body.quantityKg)
    const offeredPriceUSD = Number(body.offeredPriceUSD)
    const listedPriceUSD = Number(body.listedPriceUSD)

    if (!body.productName || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Product name, customer name, and email are required' },
        { status: 400 }
      )
    }

    if (!quantityKg || !offeredPriceUSD || !listedPriceUSD) {
      return NextResponse.json(
        { success: false, error: 'Quantity, offered price, and listed price are required' },
        { status: 400 }
      )
    }

    const bot = generateBotReply(quantityKg, offeredPriceUSD, listedPriceUSD)

    const negotiation = await Negotiation.create({
      productId: body.productId || undefined,
      productName: body.productName,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerCountry: body.customerCountry || '',
      quantityKg,
      offeredPriceUSD,
      listedPriceUSD,
      botReply: bot.reply,
      finalAgreedPriceUSD: bot.agreedPrice,
      status: bot.status === 'accepted' ? 'accepted' : 'pending',
      chatHistory: [
        {
          sender: 'customer',
          message: `Customer offered $${offeredPriceUSD.toFixed(2)}/kg for ${quantityKg}kg.`,
          timestamp: new Date()
        },
        {
          sender: 'bot',
          message: bot.reply,
          timestamp: new Date()
        }
      ]
    })

    return NextResponse.json(
      {
        success: true,
        negotiation,
        botReply: bot.reply,
        reply: bot.reply,
        agreedPrice: bot.agreedPrice,
        status: bot.status
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/negotiations error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create negotiation' },
      { status: 500 }
    )
  }
}

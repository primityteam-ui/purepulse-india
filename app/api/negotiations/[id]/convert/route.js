import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Negotiation from '@/models/Negotiation'
import Order from '@/models/Order'

export async function POST(request, { params }) {
  try {
    await connectDB()

    const body = await request.json().catch(() => ({}))

    const negotiation = await Negotiation.findById(params.id)

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'Negotiation not found' },
        { status: 404 }
      )
    }

    const finalPrice = Number(negotiation.finalAgreedPriceUSD || negotiation.offeredPriceUSD)
    const quantityKg = Number(negotiation.quantityKg)
    const totalUSD = finalPrice * quantityKg

    const order = await Order.create({
      customerName: negotiation.customerName,
      customerEmail: negotiation.customerEmail,
      customerPhone: body.customerPhone || '',
      customerCountry: negotiation.customerCountry || '',
      customerAddress: {
        line1: body.line1 || '',
        line2: body.line2 || '',
        city: body.city || '',
        state: body.state || '',
        postalCode: body.postalCode || '',
        country: negotiation.customerCountry || body.country || ''
      },
      items: [
        {
          productId: negotiation.productId,
          productName: negotiation.productName,
          variant: `${quantityKg}kg bulk deal`,
          quantity: 1,
          priceUSD: totalUSD,
          pricePaid: totalUSD,
          currencyPaid: 'USD'
        }
      ],
      subtotalUSD: totalUSD,
      discountPercent: 0,
      discountAmountUSD: 0,
      totalUSD,
      totalPaid: totalUSD,
      currencyPaid: 'USD',
      paymentMethod: 'manual',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      notes: `Manual order created from negotiation. Final agreed price: $${finalPrice.toFixed(2)}/kg for ${quantityKg}kg.`
    })

    negotiation.status = 'converted_to_order'
    negotiation.adminNotes = `${negotiation.adminNotes || ''}\nConverted to order ${order.orderNumber}.`.trim()
    await negotiation.save()

    return NextResponse.json({
      success: true,
      order,
      negotiation
    })
  } catch (error) {
    console.error('POST /api/negotiations/[id]/convert error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to convert negotiation to order' },
      { status: 500 }
    )
  }
}

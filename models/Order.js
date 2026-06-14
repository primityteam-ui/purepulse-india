import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: String,

    customerName: String,
    customerEmail: String,
    customerPhone: String,
    customerCountry: String,

    customerAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },

    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        variant: String,
        quantity: Number,
        priceUSD: Number,
        pricePaid: Number,
        currencyPaid: String
      }
    ],

    subtotalUSD: Number,
    discountPercent: Number,
    discountAmountUSD: Number,

    shippingUSD: { type: Number, default: 0 },
    taxUSD: { type: Number, default: 0 },
    totalUSD: Number,

    subtotalPaid: Number,
    shippingPaid: Number,
    taxPaid: Number,
    totalPaid: Number,

    currencyPaid: String,

    shippingType: String,
    totalWeightKg: Number,
    customsNote: String,
    buyerResponsibilityNote: String,

    paymentMethod: String,
    paymentStatus: { type: String, default: 'pending' },
    paymentIntentId: String,

    orderStatus: { type: String, default: 'processing' },
    trackingNumber: String,
    shippingCarrier: String,
    notes: String
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    message: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
)

const NegotiationSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    variant: { type: String, default: '' },

    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerCountry: { type: String, default: '' },

    quantityKg: { type: Number, required: true },
    listedPriceUSD: { type: Number, required: true },
    offeredPriceUSD: { type: Number, required: true },
    offeredPricePerKg: { type: Number, default: 0 },

    finalAgreedPriceUSD: { type: Number, default: null },
    adminReply: { type: String, default: '' },
    adminNotes: { type: String, default: '' },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'converted_to_order', 'counter', 'minimum_not_met'],
      default: 'pending'
    },

    chatHistory: [ChatMessageSchema]
  },
  { timestamps: true }
)

export default mongoose.models.Negotiation || mongoose.model('Negotiation', NegotiationSchema)

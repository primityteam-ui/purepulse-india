import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, default: 'customer' },
    message: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
)

const NegotiationSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerCountry: { type: String, default: '' },
    quantityKg: { type: Number, required: true },
    offeredPriceUSD: { type: Number, required: true },
    listedPriceUSD: { type: Number, required: true },
    botReply: { type: String, default: '' },
    finalAgreedPriceUSD: { type: Number, default: null },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'converted_to_order', 'counter', 'minimum_not_met'],
      default: 'pending'
    },
    adminNotes: { type: String, default: '' },
    chatHistory: [ChatMessageSchema]
  },
  { timestamps: true }
)

export default mongoose.models.Negotiation || mongoose.model('Negotiation', NegotiationSchema)

import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    variant: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceUSD: { type: Number, required: true },
    pricePaid: { type: Number, default: 0 },
    currencyPaid: { type: String, default: 'USD' }
  },
  { _id: false }
)

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String, default: '' },
    customerCountry: { type: String, default: '' },
    customerAddress: { type: AddressSchema, default: {} },
    items: [OrderItemSchema],
    subtotalUSD: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountAmountUSD: { type: Number, default: 0 },
    totalUSD: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    currencyPaid: { type: String, default: 'USD' },
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'manual', 'pending'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentIntentId: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    trackingNumber: { type: String, default: '' },
    shippingCarrier: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
)

OrderSchema.pre('save', function setOrderNumber(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear()
    const random = Math.floor(10000 + Math.random() * 90000)
    this.orderNumber = `PP-${year}-${random}`
  }

  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

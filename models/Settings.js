import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    saleBannerEnabled: { type: Boolean, default: true },
    saleBannerText: {
      type: String,
      default: 'Launch offer: Premium organic Indian pulses now available for global orders.'
    },
    bulkDiscountEnabled: { type: Boolean, default: true },
    bulkDiscountMinKg: { type: Number, default: 25 },
    bulkDiscountPercent: { type: Number, default: 10 },
    whatsappNumber: { type: String, default: '91XXXXXXXXXX' },
    businessEmail: { type: String, default: 'sales@farmorigin.com' },
    minimumNegotiationKg: { type: Number, default: 25 },
    stripeEnabled: { type: Boolean, default: true },
    razorpayEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)

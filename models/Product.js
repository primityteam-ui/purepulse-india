import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    healthBenefits: { type: String, default: '' },
    origin: { type: String, default: '' },
    badge: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    image: { type: String, default: '' },
    priceUSD: { type: Number, required: true },
    variants: {
      type: Map,
      of: Number,
      default: {}
    },
    nutritionPer100g: {
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      calories: { type: Number, default: 0 }
    },
    certifications: [{ type: String }]
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)

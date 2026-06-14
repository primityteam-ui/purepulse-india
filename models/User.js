import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, default: '' },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer'
    },
    phone: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)

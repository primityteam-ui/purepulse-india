import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const name = body.name?.trim()
    const email = body.email?.toLowerCase()?.trim()
    const password = body.password
    const phone = body.phone?.trim() || ''
    const country = body.country?.trim() || ''

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and password are required.'
        },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters.'
        },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account already exists with this email.'
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      country,
      role: 'customer'
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Customer account created successfully.'
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Could not create customer account.'
      },
      { status: 500 }
    )
  }
}

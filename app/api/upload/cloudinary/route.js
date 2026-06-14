import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary environment variables are missing' },
        { status: 500 }
      )
    }

    const upload = await cloudinary.uploader.upload(image, {
      folder: 'farmorigin-products',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 900, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
      publicId: upload.public_id
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    )
  }
}

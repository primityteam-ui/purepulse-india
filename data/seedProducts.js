import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import mongoose from 'mongoose'
import Product from '../models/Product.js'
const products = [
  {
    "name": "Red Lentils (Masoor Dal)",
    "category": "Lentils",
    "description": "Premium organic Red Lentils (Masoor Dal) sourced from Madhya Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh, India",
    "badge": "Best Seller",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 1.8,
    "variants": {
      "500g": 1.1,
      "1kg": 1.8,
      "5kg": 8.0,
      "25kg": 35.0,
      "50kg": 65.0
    },
    "nutritionPer100g": {
      "protein": 26,
      "carbohydrates": 60,
      "fiber": 11,
      "fat": 1.1,
      "calories": 353
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Toor Dal (Yellow Lentils)",
    "category": "Lentils",
    "description": "Premium organic Toor Dal (Yellow Lentils) sourced from Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Rajasthan, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.6,
    "variants": {
      "500g": 0.95,
      "1kg": 1.6,
      "5kg": 7.5,
      "25kg": 32.0,
      "50kg": 60.0
    },
    "nutritionPer100g": {
      "protein": 22,
      "carbohydrates": 63,
      "fiber": 15,
      "fat": 1.5,
      "calories": 343
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Urad Dal Whole (Black Lentils)",
    "category": "Lentils",
    "description": "Premium organic Urad Dal Whole (Black Lentils) sourced from Uttar Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Uttar Pradesh, India",
    "badge": "Organic",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 2.0,
    "variants": {
      "500g": 1.2,
      "1kg": 2.0,
      "5kg": 9.0,
      "25kg": 40.0,
      "50kg": 75.0
    },
    "nutritionPer100g": {
      "protein": 25,
      "carbohydrates": 59,
      "fiber": 18,
      "fat": 1.4,
      "calories": 341
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Moong Dal (Green Split)",
    "category": "Lentils",
    "description": "Premium organic Moong Dal (Green Split) sourced from Madhya Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh, India",
    "badge": "Best Seller",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 1.75,
    "variants": {
      "500g": 1.05,
      "1kg": 1.75,
      "5kg": 8.0,
      "25kg": 36.0,
      "50kg": 67.0
    },
    "nutritionPer100g": {
      "protein": 24,
      "carbohydrates": 63,
      "fiber": 16,
      "fat": 1.2,
      "calories": 347
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Chana Dal (Bengal Gram Split)",
    "category": "Chickpeas",
    "description": "Premium organic Chana Dal (Bengal Gram Split) sourced from Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Rajasthan, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.5,
    "variants": {
      "500g": 0.9,
      "1kg": 1.5,
      "5kg": 6.8,
      "25kg": 30.0,
      "50kg": 55.0
    },
    "nutritionPer100g": {
      "protein": 20,
      "carbohydrates": 65,
      "fiber": 17,
      "fat": 5.0,
      "calories": 364
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Kabuli Chana (White Chickpeas)",
    "category": "Chickpeas",
    "description": "Premium organic Kabuli Chana (White Chickpeas) sourced from Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Rajasthan, India",
    "badge": "Premium",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 2.2,
    "variants": {
      "500g": 1.3,
      "1kg": 2.2,
      "5kg": 10.0,
      "25kg": 45.0,
      "50kg": 85.0
    },
    "nutritionPer100g": {
      "protein": 19,
      "carbohydrates": 61,
      "fiber": 17,
      "fat": 6.0,
      "calories": 364
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Kala Chana (Black Chickpeas)",
    "category": "Chickpeas",
    "description": "Premium organic Kala Chana (Black Chickpeas) sourced from Madhya Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.7,
    "variants": {
      "500g": 1.0,
      "1kg": 1.7,
      "5kg": 7.8,
      "25kg": 34.0,
      "50kg": 63.0
    },
    "nutritionPer100g": {
      "protein": 19,
      "carbohydrates": 62,
      "fiber": 21,
      "fat": 5.5,
      "calories": 360
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Rajma Red (Kidney Beans)",
    "category": "Beans",
    "description": "Premium organic Rajma Red (Kidney Beans) sourced from Himachal Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Himachal Pradesh, India",
    "badge": "Popular",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 2.5,
    "variants": {
      "500g": 1.5,
      "1kg": 2.5,
      "5kg": 11.0,
      "25kg": 50.0,
      "50kg": 95.0
    },
    "nutritionPer100g": {
      "protein": 24,
      "carbohydrates": 60,
      "fiber": 25,
      "fat": 0.8,
      "calories": 333
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Lobia (Black-Eyed Beans)",
    "category": "Beans",
    "description": "Premium organic Lobia (Black-Eyed Beans) sourced from Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Rajasthan, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.9,
    "variants": {
      "500g": 1.1,
      "1kg": 1.9,
      "5kg": 8.5,
      "25kg": 38.0,
      "50kg": 70.0
    },
    "nutritionPer100g": {
      "protein": 24,
      "carbohydrates": 60,
      "fiber": 11,
      "fat": 1.3,
      "calories": 336
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Matki (Moth Beans)",
    "category": "Beans",
    "description": "Premium organic Matki (Moth Beans) sourced from Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Rajasthan, India",
    "badge": "Rare",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 2.1,
    "variants": {
      "500g": 1.25,
      "1kg": 2.1,
      "5kg": 9.5,
      "25kg": 42.0,
      "50kg": 78.0
    },
    "nutritionPer100g": {
      "protein": 23,
      "carbohydrates": 62,
      "fiber": 8,
      "fat": 1.6,
      "calories": 343
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Sabut Matar (Whole Green Peas)",
    "category": "Peas",
    "description": "Premium organic Sabut Matar (Whole Green Peas) sourced from Uttar Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Uttar Pradesh, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.4,
    "variants": {
      "500g": 0.85,
      "1kg": 1.4,
      "5kg": 6.2,
      "25kg": 28.0,
      "50kg": 52.0
    },
    "nutritionPer100g": {
      "protein": 23,
      "carbohydrates": 64,
      "fiber": 26,
      "fat": 1.2,
      "calories": 339
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Yellow Split Peas",
    "category": "Peas",
    "description": "Premium organic Yellow Split Peas sourced from Madhya Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh, India",
    "badge": "",
    "inStock": true,
    "featured": false,
    "image": "/images/pulses.svg",
    "priceUSD": 1.3,
    "variants": {
      "500g": 0.8,
      "1kg": 1.3,
      "5kg": 5.8,
      "25kg": 26.0,
      "50kg": 48.0
    },
    "nutritionPer100g": {
      "protein": 25,
      "carbohydrates": 63,
      "fiber": 8,
      "fat": 0.4,
      "calories": 352
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Kulthi (Horse Gram)",
    "category": "Special",
    "description": "Premium organic Kulthi (Horse Gram) sourced from Madhya Pradesh, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh, India",
    "badge": "Superfood",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 2.8,
    "variants": {
      "500g": 1.7,
      "1kg": 2.8,
      "5kg": 12.5,
      "25kg": 55.0,
      "50kg": 100.0
    },
    "nutritionPer100g": {
      "protein": 29,
      "carbohydrates": 57,
      "fiber": 5,
      "fat": 0.5,
      "calories": 321
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  },
  {
    "name": "Organic 5-Dal Mix Pack",
    "category": "Special",
    "description": "Premium organic Organic 5-Dal Mix Pack sourced from Madhya Pradesh and Rajasthan, India. Cleaned, naturally dried, and export packed for families, restaurants, retailers, and wholesale buyers worldwide.",
    "healthBenefits": "Rich in plant-based protein, fiber, minerals, and slow-release carbohydrates. Great for balanced vegetarian and vegan meals.",
    "origin": "Madhya Pradesh and Rajasthan, India",
    "badge": "New",
    "inStock": true,
    "featured": true,
    "image": "/images/pulses.svg",
    "priceUSD": 2.3,
    "variants": {
      "1kg": 2.3,
      "3kg": 6.5,
      "5kg": 10.5
    },
    "nutritionPer100g": {
      "protein": 24,
      "carbohydrates": 62,
      "fiber": 14,
      "fat": 1.3,
      "calories": 349
    },
    "certifications": [
      "FSSAI",
      "USDA Organic",
      "EU Organic",
      "Lab Tested"
    ]
  }
]
async function seed(){try{await mongoose.connect(process.env.MONGODB_URI);await Product.deleteMany({});await Product.insertMany(products);console.log('Seeded '+products.length+' products');process.exit(0)}catch(e){console.error(e);process.exit(1)}}
seed()

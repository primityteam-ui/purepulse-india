import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import Product from '../models/Product.js'

const imageMap = [
  ['Red Lentils (Masoor Dal)', '/images/products/red-lentils.jpg'],
  ['Toor Dal (Yellow Lentils)', '/images/products/toor-dal.jpg'],
  ['Urad Dal Whole (Black Lentils)', '/images/products/urad-dal.jpg'],
  ['Moong Dal (Green Split)', '/images/products/moong-dal.jpg'],
  ['Chana Dal (Bengal Gram Split)', '/images/products/chana-dal.jpg'],
  ['Kabuli Chana (White Chickpeas)', '/images/products/kabuli-chana.jpg'],
  ['Kala Chana (Black Chickpeas)', '/images/products/kala-chana.jpg'],
  ['Rajma Red (Kidney Beans)', '/images/products/rajma-red.jpg'],
  ['Lobia (Black-Eyed Beans)', '/images/products/lobia.jpg'],
  ['Matki (Moth Beans)', '/images/products/matki.jpg'],
  ['Sabut Matar (Whole Green Peas)', '/images/products/sabut-matar.jpg'],
  ['Yellow Split Peas', '/images/products/yellow-split-peas.jpg'],
  ['Kulthi (Horse Gram)', '/images/products/kulthi.jpg'],
  ['Organic 5-Dal Mix Pack', '/images/products/five-dal-mix.jpg']
]

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing in .env.local')
  }

  await mongoose.connect(process.env.MONGODB_URI)

  for (const [name, image] of imageMap) {
    await Product.updateOne(
      { name },
      { $set: { image } }
    )
    console.log(`Updated image for ${name}`)
  }

  await mongoose.disconnect()
  console.log('All product image paths updated.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

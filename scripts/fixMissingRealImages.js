import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import Product from '../models/Product.js'

const fallbackMap = [
  ['Urad Dal Whole (Black Lentils)', '/images/products/urad-dal-black-lentils.svg'],
  ['Kala Chana (Black Chickpeas)', '/images/products/kala-chana-black-chickpeas.svg'],
  ['Lobia (Black-Eyed Beans)', '/images/products/lobia-black-eyed-beans.svg'],
  ['Matki (Moth Beans)', '/images/products/matki-moth-beans.svg'],
  ['Yellow Split Peas', '/images/products/yellow-split-peas.svg'],

  ['Kabuli Chana (White Chickpeas)', '/images/products/kabuli-chana.jpg'],
  ['Rajma Red (Kidney Beans)', '/images/products/rajma-red.jpg'],
  ['Sabut Matar (Whole Green Peas)', '/images/products/sabut-matar.jpg'],
  ['Kulthi (Horse Gram)', '/images/products/kulthi.jpg'],
  ['Organic 5-Dal Mix Pack', '/images/products/five-dal-mix.jpg']
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)

  for (const [name, image] of fallbackMap) {
    await Product.updateOne({ name }, { $set: { image } })
    console.log(`Fixed image for ${name}`)
  }

  await mongoose.disconnect()
  console.log('Missing product images fixed.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

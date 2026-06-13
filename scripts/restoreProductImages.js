import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import Product from '../models/Product.js'

const imageMap = [
  ['Red Lentils (Masoor Dal)', '/images/products/red-lentils-masoor-dal.svg'],
  ['Toor Dal (Yellow Lentils)', '/images/products/toor-dal-yellow-lentils.svg'],
  ['Urad Dal Whole (Black Lentils)', '/images/products/urad-dal-black-lentils.svg'],
  ['Moong Dal (Green Split)', '/images/products/moong-dal-green-split.svg'],
  ['Chana Dal (Bengal Gram Split)', '/images/products/chana-dal-bengal-gram.svg'],
  ['Kabuli Chana (White Chickpeas)', '/images/products/kabuli-chana-white-chickpeas.svg'],
  ['Kala Chana (Black Chickpeas)', '/images/products/kala-chana-black-chickpeas.svg'],
  ['Rajma Red (Kidney Beans)', '/images/products/rajma-red-kidney-beans.svg'],
  ['Lobia (Black-Eyed Beans)', '/images/products/lobia-black-eyed-beans.svg'],
  ['Matki (Moth Beans)', '/images/products/matki-moth-beans.svg'],
  ['Sabut Matar (Whole Green Peas)', '/images/products/sabut-matar-green-peas.svg'],
  ['Yellow Split Peas', '/images/products/yellow-split-peas.svg'],
  ['Kulthi (Horse Gram)', '/images/products/kulthi-horse-gram.svg'],
  ['Organic 5-Dal Mix Pack', '/images/products/organic-5-dal-mix-pack.svg']
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)

  for (const [name, image] of imageMap) {
    await Product.updateOne({ name }, { $set: { image } })
    console.log(`Restored ${name}`)
  }

  await mongoose.disconnect()
  console.log('Product images restored.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

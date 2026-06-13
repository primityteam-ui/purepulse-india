import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const images = [
  ['Red Lentils (Masoor Dal)', 'red-lentils.jpg', 'Masoor dal.JPG'],
  ['Toor Dal (Yellow Lentils)', 'toor-dal.jpg', 'Toor dal.jpg'],
  ['Urad Dal Whole (Black Lentils)', 'urad-dal.jpg', 'Urad Dal.jpg'],
  ['Moong Dal (Green Split)', 'moong-dal.jpg', 'Moong Dal.jpg'],
  ['Chana Dal (Bengal Gram Split)', 'chana-dal.jpg', 'Chana dal.jpg'],
  ['Kabuli Chana (White Chickpeas)', 'kabuli-chana.jpg', 'Chickpea.jpg'],
  ['Kala Chana (Black Chickpeas)', 'kala-chana.jpg', 'Black chickpeas.jpg'],
  ['Rajma Red (Kidney Beans)', 'rajma-red.jpg', 'Red kidney beans.jpg'],
  ['Lobia (Black-Eyed Beans)', 'lobia.jpg', 'Black-eyed peas.jpg'],
  ['Matki (Moth Beans)', 'matki.jpg', 'Moth bean.jpg'],
  ['Sabut Matar (Whole Green Peas)', 'sabut-matar.jpg', 'Green peas.jpg'],
  ['Yellow Split Peas', 'yellow-split-peas.jpg', 'Split peas.jpg'],
  ['Kulthi (Horse Gram)', 'kulthi.jpg', 'Horse gram.jpg'],
  ['Organic 5-Dal Mix Pack', 'five-dal-mix.jpg', 'Legumes.jpg']
]

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    const request = client.get(
      url,
      {
        headers: {
          'User-Agent': 'PurePulseIndia/1.0 (local development; contact: sales@purepulseindia.com)',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      },
      (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          const redirectUrl = response.headers.location

          if (!redirectUrl) {
            reject(new Error(`Redirect without location for ${url}`))
            return
          }

          download(redirectUrl, destination).then(resolve).catch(reject)
          return
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status ${response.statusCode} for ${url}`))
          return
        }

        const file = fs.createWriteStream(destination)
        response.pipe(file)

        file.on('finish', () => {
          file.close(resolve)
        })

        file.on('error', reject)
      }
    )

    request.on('error', reject)
  })
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing in .env.local')
  }

  const imageDir = path.join(process.cwd(), 'public', 'images', 'products')
  fs.mkdirSync(imageDir, { recursive: true })

  const successfulImages = []

  for (const [productName, fileName, commonsFile] of images) {
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFile)}?width=900`
    const destination = path.join(imageDir, fileName)

    try {
      console.log(`Downloading ${productName}...`)
      await download(url, destination)
      successfulImages.push({ productName, fileName })
      console.log(`Saved ${fileName}`)
    } catch (error) {
      console.log(`Failed ${productName}: ${error.message}`)
    }
  }

  await mongoose.connect(process.env.MONGODB_URI)

  for (const item of successfulImages) {
    await Product.updateOne(
      { name: item.productName },
      { $set: { image: `/images/products/${item.fileName}` } }
    )

    console.log(`Updated MongoDB: ${item.productName}`)
  }

  await mongoose.disconnect()

  console.log(`Done. Downloaded and updated ${successfulImages.length} product images.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

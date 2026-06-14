import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const products = [
  {
    name: 'Red Lentils (Masoor Dal)',
    file: 'red-lentils-masoor-dal.svg',
    title: 'Red Lentils',
    subtitle: 'Masoor Dal',
    colors: ['#e46245', '#f28f5b', '#b94b35']
  },
  {
    name: 'Toor Dal (Yellow Lentils)',
    file: 'toor-dal-yellow-lentils.svg',
    title: 'Toor Dal',
    subtitle: 'Yellow Lentils',
    colors: ['#e7b739', '#f5d66a', '#b88722']
  },
  {
    name: 'Urad Dal Whole (Black Lentils)',
    file: 'urad-dal-black-lentils.svg',
    title: 'Urad Dal',
    subtitle: 'Black Lentils',
    colors: ['#27221e', '#4c3f35', '#11100e']
  },
  {
    name: 'Moong Dal (Green Split)',
    file: 'moong-dal-green-split.svg',
    title: 'Moong Dal',
    subtitle: 'Green Split',
    colors: ['#6ea64b', '#a9cf63', '#477d36']
  },
  {
    name: 'Chana Dal (Bengal Gram Split)',
    file: 'chana-dal-bengal-gram.svg',
    title: 'Chana Dal',
    subtitle: 'Bengal Gram',
    colors: ['#d39a2f', '#f1c45a', '#a87324']
  },
  {
    name: 'Kabuli Chana (White Chickpeas)',
    file: 'kabuli-chana-white-chickpeas.svg',
    title: 'Kabuli Chana',
    subtitle: 'White Chickpeas',
    colors: ['#d9c19a', '#f1dfbb', '#aa8e67']
  },
  {
    name: 'Kala Chana (Black Chickpeas)',
    file: 'kala-chana-black-chickpeas.svg',
    title: 'Kala Chana',
    subtitle: 'Black Chickpeas',
    colors: ['#3d2b22', '#6f5141', '#1d1511']
  },
  {
    name: 'Rajma Red (Kidney Beans)',
    file: 'rajma-red-kidney-beans.svg',
    title: 'Rajma Red',
    subtitle: 'Kidney Beans',
    colors: ['#8f2c2c', '#b84242', '#5f1d1d']
  },
  {
    name: 'Lobia (Black-Eyed Beans)',
    file: 'lobia-black-eyed-beans.svg',
    title: 'Lobia',
    subtitle: 'Black-Eyed Beans',
    colors: ['#efe2c3', '#ffffff', '#5c4630']
  },
  {
    name: 'Matki (Moth Beans)',
    file: 'matki-moth-beans.svg',
    title: 'Matki',
    subtitle: 'Moth Beans',
    colors: ['#9d7b45', '#c8a25c', '#6f552e']
  },
  {
    name: 'Sabut Matar (Whole Green Peas)',
    file: 'sabut-matar-green-peas.svg',
    title: 'Sabut Matar',
    subtitle: 'Whole Green Peas',
    colors: ['#6ea034', '#a6cf50', '#4f7627']
  },
  {
    name: 'Yellow Split Peas',
    file: 'yellow-split-peas.svg',
    title: 'Yellow Split Peas',
    subtitle: 'Organic Peas',
    colors: ['#dfb832', '#f4d85d', '#b28a1f']
  },
  {
    name: 'Kulthi (Horse Gram)',
    file: 'kulthi-horse-gram.svg',
    title: 'Kulthi',
    subtitle: 'Horse Gram',
    colors: ['#8b5b36', '#ba8754', '#5d3a22']
  },
  {
    name: 'Organic 5-Dal Mix Pack',
    file: 'organic-5-dal-mix-pack.svg',
    title: '5-Dal Mix',
    subtitle: 'Organic Blend',
    colors: ['#e46245', '#e7b739', '#6ea64b']
  }
]

function createSvg(product) {
  const [c1, c2, c3] = product.colors

  const circles = Array.from({ length: 65 }).map((_, index) => {
    const x = 35 + (index % 13) * 20 + ((index * 7) % 9)
    const y = 65 + Math.floor(index / 13) * 22 + ((index * 5) % 8)
    const color = [c1, c2, c3][index % 3]
    const r = 9 + (index % 5)
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.95"/>`
  }).join('')

  return `
<svg width="900" height="650" viewBox="0 0 900 650" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="650" rx="48" fill="#F8F0DF"/>
  <rect x="28" y="28" width="844" height="594" rx="40" fill="#FFF8E8"/>
  <circle cx="735" cy="90" r="140" fill="#DFF7E8"/>
  <circle cx="145" cy="555" r="170" fill="#F3D27A" opacity="0.35"/>

  <g transform="translate(300 145)">
    <ellipse cx="150" cy="320" rx="255" ry="52" fill="#0B3D2B" opacity="0.14"/>
    <path d="M60 115C77 45 223 45 240 115L288 342C302 407 257 465 190 465H110C43 465-2 407 12 342L60 115Z" fill="#FFFFFF"/>
    <path d="M74 126C88 70 212 70 226 126L270 338C282 391 246 438 190 438H110C54 438 18 391 30 338L74 126Z" fill="#F9E9C8"/>
    <path d="M78 142H222L258 318H42L78 142Z" fill="#FFFFFF" opacity="0.62"/>
    <g clip-path="url(#clip)">
      ${circles}
    </g>
    <path d="M78 142H222L258 318H42L78 142Z" stroke="#0B3D2B" stroke-opacity="0.14" stroke-width="5"/>
    <rect x="76" y="72" width="148" height="70" rx="28" fill="#0B3D2B"/>
    <text x="150" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="900" fill="#F1CF75">PURE</text>
  </g>

  <text x="450" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="900" fill="#0B3D2B">${product.title}</text>
  <text x="450" y="553" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#1F6B4A">${product.subtitle}</text>
  <text x="450" y="594" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#8A641F">Farm Origin • Organic • Lab Tested</text>

  <defs>
    <clipPath id="clip">
      <path d="M78 142H222L258 318H42L78 142Z"/>
    </clipPath>
  </defs>
</svg>
`.trim()
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing in .env.local')
  }

  const outputDir = path.join(process.cwd(), 'public', 'images', 'products')
  fs.mkdirSync(outputDir, { recursive: true })

  for (const product of products) {
    const svg = createSvg(product)
    fs.writeFileSync(path.join(outputDir, product.file), svg, 'utf8')
  }

  await mongoose.connect(process.env.MONGODB_URI)

  for (const product of products) {
    await Product.updateOne(
      { name: product.name },
      { $set: { image: `/images/products/${product.file}` } }
    )
  }

  await mongoose.disconnect()

  console.log('Created product images and updated MongoDB image paths.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

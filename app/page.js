import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'

async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products?featured=true`, { cache: 'no-store' })

    if (!response.ok) return []

    const data = await response.json()
    return Array.isArray(data.products) ? data.products.slice(0, 4) : []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <>
      <HeroSection />

      <section className="section-padding">
        <div className="container-premium">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="badge-premium mb-4">Customer favorites</div>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight text-green-950 md:text-5xl">
                Best-selling organic pulses
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-green-950/62">
                Clean, protein-rich Indian staples selected for taste, nutrition, and export quality.
              </p>
            </div>
            <Link href="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      <section className="section-padding bg-green-950 text-white">
        <div className="container-premium">
          <div className="mb-10 text-center">
            <div className="badge-premium mb-4 bg-white/10 text-[#f1cf75]">Why buyers trust us</div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Premium from farm to package
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {[
              ['🌱', 'Organic sourcing', 'Carefully selected pulses from trusted Indian farming regions.'],
              ['🧪', 'Lab tested', 'Quality checked before packing for better buyer confidence.'],
              ['📦', 'Retail and bulk', 'From 500g family packs to 50kg wholesale export orders.'],
              ['🌍', 'Global-ready', 'Built for international customers, currency detection, and export inquiries.']
            ].map((item) => (
              <div key={item[1]} className="rounded-3xl border border-white/10 bg-white/8 p-6">
                <div className="text-4xl">{item[0]}</div>
                <h3 className="mt-5 text-xl font-black">{item[1]}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{item[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-2">
          <div className="card-premium p-8 md:p-10">
            <div className="badge-premium mb-5">Bulk orders</div>
            <h2 className="text-4xl font-black text-green-950">Buying 25kg or more?</h2>
            <p className="mt-4 text-lg leading-8 text-green-950/62">
              Request wholesale pricing for restaurants, grocery stores, distributors, and export buyers. You can negotiate directly from each product page.
            </p>
            <Link href="/bulk" className="btn-primary mt-7">
              Request Bulk Quote
            </Link>
          </div>

          <div className="card-premium p-8 md:p-10">
            <div className="badge-premium mb-5">Our story</div>
            <h2 className="text-4xl font-black text-green-950">Indian staples, global standard.</h2>
            <p className="mt-4 text-lg leading-8 text-green-950/62">
              PurePulse India was created to make premium Indian pulses feel modern, trustworthy, and easy to buy for families and businesses around the world.
            </p>
            <Link href="/about" className="btn-secondary mt-7">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
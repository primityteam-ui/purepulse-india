import Link from 'next/link'

export default function FarmingPage() {
  return (
    <div>
      <section className="bg-green-950 py-24 text-white">
        <div className="container-premium">
          <div className="badge-premium mb-5 bg-white/10 text-[#f1cf75]">How we farm</div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Traditional Indian farming, presented with global standards.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Our farming page should make customers feel the product is natural, traceable, clean, and carefully handled.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['1', 'Sourced from known regions', 'Each pulse is connected to strong Indian growing regions like Madhya Pradesh, Rajasthan, Uttar Pradesh, and Himachal Pradesh.'],
              ['2', 'Cleaned and sorted', 'Products are positioned as stone-sorted, triple-cleaned, and packed for modern retail and bulk buyers.'],
              ['3', 'Packed for global buyers', 'The brand focuses on clear labeling, certifications, and export-friendly communication.']
            ].map((step) => (
              <div key={step[0]} className="card-premium p-8">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-950 text-2xl font-black text-[#f1cf75]">{step[0]}</div>
                <h2 className="mt-6 text-2xl font-black text-green-950">{step[1]}</h2>
                <p className="mt-4 leading-7 text-green-950/62">{step[2]}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 card-premium grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-4xl font-black text-green-950">Built around buyer trust</h2>
              <p className="mt-5 leading-8 text-green-950/65">
                Farming content should not feel like a random story. It should help customers believe the product is clean, reliable, and worth a premium price.
              </p>
            </div>
            <div className="product-image-fallback min-h-72 rounded-[2rem] p-8 text-center">
              <div className="text-8xl">🌾</div>
              <h3 className="mt-5 text-2xl font-black text-green-950">Organic pulse sourcing</h3>
              <p className="mt-3 text-green-950/60">Farm to pack, with premium brand presentation.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/shop" className="btn-primary">Explore Products</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

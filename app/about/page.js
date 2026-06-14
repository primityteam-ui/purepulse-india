import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      <section className="bg-green-950 py-24 text-white">
        <div className="container-premium">
          <div className="badge-premium mb-5 bg-white/10 text-[#f1cf75]">Our story</div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Indian pulses deserve a premium global brand.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Farm Origin is built around a simple idea: make Indian organic lentils, dals, chickpeas, and beans feel as premium and trustworthy as any global health-food brand.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-2">
          <div className="card-premium p-8 md:p-10">
            <h2 className="text-3xl font-black text-green-950">What we sell</h2>
            <p className="mt-4 leading-8 text-green-950/65">
              We sell organic Indian pulses for homes, restaurants, grocery stores, distributors, and bulk buyers. Our catalog includes everyday staples like Masoor Dal and Toor Dal, plus premium products like Kabuli Chana, Rajma, and Horse Gram.
            </p>
          </div>

          <div className="card-premium p-8 md:p-10">
            <h2 className="text-3xl font-black text-green-950">Who we serve</h2>
            <p className="mt-4 leading-8 text-green-950/65">
              We serve Indian families living abroad, health-conscious global customers, restaurants, small grocery stores, and international bulk buyers who want clean Indian staples with clear pricing and simple ordering.
            </p>
          </div>

          <div className="card-premium p-8 md:p-10">
            <h2 className="text-3xl font-black text-green-950">Our quality promise</h2>
            <p className="mt-4 leading-8 text-green-950/65">
              The brand is positioned around clean sourcing, better packaging, lab-tested confidence, and international buyer trust. Every page is designed to make the customer feel safe before ordering.
            </p>
          </div>

          <div className="card-premium p-8 md:p-10">
            <h2 className="text-3xl font-black text-green-950">Why this brand can work</h2>
            <p className="mt-4 leading-8 text-green-950/65">
              Indian pulses are already loved worldwide, but many sellers look outdated online. Farm Origin is designed to look modern, premium, and easy to buy from.
            </p>
          </div>
        </div>

        <div className="container-premium mt-10">
          <div className="rounded-[2rem] bg-green-950 p-8 text-white md:p-12">
            <h2 className="text-4xl font-black">Ready to shop or buy in bulk?</h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/70">
              Start with retail packs or request a larger wholesale quote.
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="btn-primary">Shop Products</Link>
              <Link href="/bulk" className="btn-secondary border-white/15 bg-white/10 text-white">Bulk Inquiry</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

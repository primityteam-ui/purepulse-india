import Link from 'next/link'
import TrustBadges from '@/components/TrustBadges'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-green-950 text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-[#d8a441] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-green-600 blur-3xl" />
      </div>

      <div className="container-premium relative grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="badge-premium mb-6 bg-white/10 text-[#f1cf75]">
            Certified organic Indian pulses for global kitchens
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
            Farm-grown Indian lentils, packed for the world.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            PurePulse India brings premium organic dals, chickpeas, beans, peas, and rare superfood pulses from trusted Indian farms to homes, restaurants, retailers, and wholesale buyers worldwide.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className="btn-primary">
              Shop Organic Pulses
            </Link>
            <Link href="/bulk" className="btn-secondary border-white/15 bg-white/10 text-white hover:border-white/35">
              Request Bulk Quote
            </Link>
          </div>

          <div className="mt-10">
            <TrustBadges />
          </div>
        </div>

        <div className="relative">
          <div className="card-premium overflow-hidden border-white/10 bg-white/10 p-5">
            <div className="rounded-[1.6rem] bg-[#fffaf0] p-5 text-green-950">
              <div className="product-image-fallback flex aspect-square items-center justify-center rounded-[1.4rem]">
                <div className="text-center">
                  <div className="mx-auto mb-6 grid h-48 w-48 place-items-center rounded-full bg-white shadow-2xl shadow-green-950/10">
                    <span className="text-7xl">🌾</span>
                  </div>
                  <h2 className="text-3xl font-black">Premium Export Pack</h2>
                  <p className="mt-3 text-sm font-semibold text-green-900/60">
                    Organic • Lab Tested • Global Shipping
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <div className="text-2xl font-black">14</div>
                  <div className="text-xs font-bold text-green-900/55">Products</div>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <div className="text-2xl font-black">25kg+</div>
                  <div className="text-xs font-bold text-green-900/55">Bulk Deals</div>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <div className="text-2xl font-black">Global</div>
                  <div className="text-xs font-bold text-green-900/55">Delivery</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-[#d8a441] p-5 text-green-950 shadow-2xl md:block">
            <div className="text-2xl font-black">Wholesale ready</div>
            <div className="text-sm font-bold opacity-70">Negotiate 25kg and above</div>
          </div>
        </div>
      </div>
    </section>
  )
}
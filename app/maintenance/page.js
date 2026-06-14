import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <section className="min-h-[calc(100vh-160px)] bg-green-950 py-24 text-white">
      <div className="container-premium">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl bg-[#d8a441] text-4xl">
            🌾
          </div>

          <div className="badge-premium mb-6 bg-white/10 text-[#f1cf75]">
            Store temporarily paused
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Farm Origin is being updated.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            We are improving products, prices, shipping, or store settings. Please check back soon.
          </p>

          <div className="mt-9 rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <h2 className="text-2xl font-black text-[#f1cf75]">Need urgent help?</h2>
            <p className="mt-3 text-white/70">
              Contact the business owner through WhatsApp or email once the store is back online.
            </p>
          </div>

          <Link href="/admin/login" className="btn-primary mt-8">
            Store Owner Login
          </Link>
        </div>
      </div>
    </section>
  )
}

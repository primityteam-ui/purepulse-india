import Link from 'next/link'

export default function OrderConfirmationPage({ searchParams }) {
  const orderNumber = searchParams?.order || 'Your order'

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="card-premium mx-auto max-w-2xl p-10 text-center">
          <div className="text-7xl">✅</div>
          <h1 className="mt-6 text-4xl font-black text-green-950">Order received</h1>
          <p className="mt-4 text-lg leading-8 text-green-950/62">
            Thank you. Your order has been created successfully.
          </p>
          <div className="mt-6 rounded-3xl bg-green-50 p-5">
            <div className="text-sm font-bold text-green-950/50">Order number</div>
            <div className="text-2xl font-black text-green-950">{orderNumber}</div>
          </div>
          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/track-order" className="btn-primary">Track Order</Link>
            <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

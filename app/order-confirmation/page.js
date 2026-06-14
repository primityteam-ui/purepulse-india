import Link from 'next/link'

export default function OrderConfirmationPage({ searchParams }) {
  const orderNumber = searchParams?.order || 'Your order'
  const paid = searchParams?.paid === 'success'
  const payment = searchParams?.payment || ''

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="card-premium mx-auto max-w-3xl p-10 text-center">
          <div className="text-7xl">✅</div>
          <h1 className="mt-6 text-4xl font-black text-green-950">Order received</h1>

          <p className="mt-4 text-lg leading-8 text-green-950/62">
            Thank you. Your order has been created successfully and is now visible to the Farm Origin admin team.
          </p>

          <div className="mt-6 rounded-3xl bg-green-50 p-5">
            <div className="text-sm font-bold text-green-950/50">Order number</div>
            <div className="text-2xl font-black text-green-950">{orderNumber}</div>
          </div>

          {paid ? (
            <div className="mt-5 rounded-3xl bg-green-100 p-5 font-bold text-green-900">
              Payment completed successfully. Your order is being confirmed.
            </div>
          ) : payment === 'manual' ? (
            <div className="mt-5 rounded-3xl bg-yellow-50 p-5 font-bold text-yellow-900">
              Invoice request received. Farm Origin will contact you to confirm payment, shipping, and delivery details.
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-yellow-50 p-5 font-bold text-yellow-900">
              Payment is pending. Farm Origin will contact you if payment confirmation is required.
            </div>
          )}

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/track-order" className="btn-primary">Track Order</Link>
            <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

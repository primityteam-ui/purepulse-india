'use client'

import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')

  async function trackOrder(event) {
    event.preventDefault()
    setStatus('Checking...')
    setOrder(null)

    try {
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok || !data.order) throw new Error('Not found')

      setOrder(data.order)
      setStatus('')
    } catch {
      setStatus('Order not found. Check your order number and email.')
    }
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="badge-premium mb-4">Track order</div>
            <h1 className="text-5xl font-black text-green-950">Check delivery status</h1>
            <p className="mt-4 text-green-950/60">Enter your order number and email.</p>
          </div>

          <form onSubmit={trackOrder} className="card-premium grid gap-4 p-6 md:p-8">
            <input className="input-premium" placeholder="Order number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
            <input className="input-premium" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="btn-primary">Track Order</button>
          </form>

          {status && <p className="mt-5 rounded-3xl bg-green-50 p-5 text-center font-bold text-green-950">{status}</p>}

          {order && (
            <div className="card-premium mt-6 p-6 md:p-8">
              <h2 className="text-3xl font-black text-green-950">{order.orderNumber}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-green-50 p-5">
                  <div className="text-sm font-bold text-green-950/50">Payment</div>
                  <div className="text-xl font-black capitalize text-green-950">{order.paymentStatus}</div>
                </div>
                <div className="rounded-3xl bg-green-50 p-5">
                  <div className="text-sm font-bold text-green-950/50">Order status</div>
                  <div className="text-xl font-black capitalize text-green-950">{order.orderStatus}</div>
                </div>
                <div className="rounded-3xl bg-green-50 p-5">
                  <div className="text-sm font-bold text-green-950/50">Carrier</div>
                  <div className="text-xl font-black text-green-950">{order.shippingCarrier || 'Not shipped yet'}</div>
                </div>
                <div className="rounded-3xl bg-green-50 p-5">
                  <div className="text-sm font-bold text-green-950/50">Tracking number</div>
                  <div className="text-xl font-black text-green-950">{order.trackingNumber || 'Not available yet'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

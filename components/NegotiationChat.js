'use client'

import { useState } from 'react'

export default function NegotiationChat({ product, onClose }) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerCountry: '',
    quantityKg: 25,
    offeredPriceUSD: product?.priceUSD || 1
  })
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitOffer(event) {
    event.preventDefault()
    setLoading(true)
    setReply('')

    try {
      const response = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          listedPriceUSD: product.priceUSD,
          ...form,
          quantityKg: Number(form.quantityKg),
          offeredPriceUSD: Number(form.offeredPriceUSD)
        })
      })

      const data = await response.json()
      setReply(data.botReply || data.reply || 'Thanks. Your offer has been received.')
    } catch {
      setReply('Sorry, we could not submit your offer right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-green-950/70 p-4 backdrop-blur-sm">
      <div className="card-premium max-h-[92vh] w-full max-w-2xl overflow-y-auto p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <div className="badge-premium mb-3">Alibaba-style negotiation</div>
            <h2 className="text-3xl font-black text-green-950">Negotiate {product.name}</h2>
            <p className="mt-2 text-sm leading-6 text-green-950/60">
              Bulk negotiation starts from 25kg. Submit your quantity and target price per kg.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full bg-green-50 px-4 py-2 font-black text-green-950">×</button>
        </div>

        <div className="mb-6 rounded-3xl bg-green-950 p-5 text-white">
          <div className="text-sm font-bold text-white/60">Farm Origin Bot</div>
          <p className="mt-2 leading-7">
            Welcome. Share your bulk quantity and offer price. We will respond with an accepted deal or a counter price.
          </p>
        </div>

        <form onSubmit={submitOffer} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input-premium" placeholder="Your name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required />
            <input className="input-premium" type="email" placeholder="Email address" value={form.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} required />
          </div>

          <input className="input-premium" placeholder="Country" value={form.customerCountry} onChange={(e) => updateField('customerCountry', e.target.value)} required />

          <div className="grid gap-4 md:grid-cols-2">
            <input className="input-premium" type="number" min="1" placeholder="Quantity in kg" value={form.quantityKg} onChange={(e) => updateField('quantityKg', e.target.value)} required />
            <input className="input-premium" type="number" min="0" step="0.01" placeholder="Offer price USD per kg" value={form.offeredPriceUSD} onChange={(e) => updateField('offeredPriceUSD', e.target.value)} required />
          </div>

          <button disabled={loading} className="btn-primary">
            {loading ? 'Checking Offer...' : 'Submit Offer'}
          </button>
        </form>

        {reply && (
          <div className="mt-6 rounded-3xl bg-[#fff7df] p-5 text-green-950">
            <div className="text-sm font-black text-green-900/55">Farm Origin Bot Reply</div>
            <p className="mt-2 leading-7 font-semibold">{reply}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1">Accept Deal</button>
              <button className="btn-secondary flex-1">Make Another Offer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

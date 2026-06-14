'use client'

import { useState } from 'react'

export default function NegotiationChat({ product, selectedVariant, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    quantityKg: '',
    offeredPricePerKg: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  async function submitOffer(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/negotiations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product?._id,
          productName: product?.name,
          variant: selectedVariant || '1kg',
          customerName: form.name,
          customerEmail: form.email,
          customerCountry: form.country,
          quantityKg: Number(form.quantityKg),
          offeredPricePerKg: Number(form.offeredPricePerKg)
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit offer')
      }

      setSuccess(true)
      setForm({
        name: '',
        email: '',
        country: '',
        quantityKg: '',
        offeredPricePerKg: ''
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[2rem] border border-emerald-100 bg-[#f8f5ec] p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-emerald-950 shadow-sm hover:bg-emerald-50"
          aria-label="Close negotiation form"
        >
          ×
        </button>

        <div className="pr-14">
          <p className="mb-3 inline-flex rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            Bulk Price Request
          </p>

          <h2 className="text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">
            Request bulk price for {product?.name}
          </h2>

          <p className="mt-3 text-sm leading-7 text-stone-600">
            Submit your quantity and target price. The store owner will review your request and contact you directly.
          </p>
        </div>

        {success ? (
          <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              ✓
            </div>
            <h3 className="text-2xl font-black text-emerald-950">
              Offer submitted successfully
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Your negotiation request has been sent to the Farm Origin admin team. They will review your offer and contact you soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary mt-6"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submitOffer} className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input-premium"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />

              <input
                className="input-premium"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>

            <input
              className="input-premium"
              placeholder="Country"
              value={form.country}
              onChange={(e) => updateField('country', e.target.value)}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input-premium"
                type="number"
                min="1"
                placeholder="Quantity in kg"
                value={form.quantityKg}
                onChange={(e) => updateField('quantityKg', e.target.value)}
                required
              />

              <input
                className="input-premium"
                type="number"
                min="0"
                step="0.01"
                placeholder="Target price per kg"
                value={form.offeredPricePerKg}
                onChange={(e) => updateField('offeredPricePerKg', e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Submitting Offer...' : 'Submit Offer to Store Owner'}
            </button>

            <p className="text-center text-xs leading-6 text-stone-500">
              This is not an automatic approval. The store owner will manually review and respond.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

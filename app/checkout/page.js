'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'
import StripeCheckout from '@/components/StripeCheckout'
import RazorpayCheckout from '@/components/RazorpayCheckout'

const INDIA_NAMES = ['india', 'in', 'bharat']

function isIndiaCountry(country) {
  return INDIA_NAMES.includes(String(country || '').trim().toLowerCase())
}

function getItemWeightKg(item) {
  const variant = String(item.variant || '').toLowerCase()
  const quantity = Number(item.quantity || 1)

  if (variant.includes('500g')) return 0.5 * quantity

  const kgMatch = variant.match(/(\d+(\.\d+)?)\s*kg/)
  if (kgMatch) return Number(kgMatch[1]) * quantity

  return quantity
}

function calculateShippingAndTax({ subtotalUSD, totalKg, country }) {
  const indiaOrder = isIndiaCountry(country)

  if (indiaOrder) {
    const domesticShippingUSD = subtotalUSD >= 60 ? 0 : Math.max(3.5, totalKg * 0.45)
    const gstUSD = subtotalUSD * 0.05

    return {
      shippingType: 'India Domestic',
      shippingUSD: Number(domesticShippingUSD.toFixed(2)),
      taxUSD: Number(gstUSD.toFixed(2)),
      customsNote:
        'Estimated domestic GST is shown for demo purposes. Final GST and invoice rules should be confirmed by the store owner or accountant.',
      buyerResponsibilityNote: ''
    }
  }

  const internationalShippingUSD = 18 + totalKg * 4.5

  return {
    shippingType: 'International Export',
    shippingUSD: Number(internationalShippingUSD.toFixed(2)),
    taxUSD: 0,
    customsNote:
      'For international orders, customs duty, import VAT, clearance charges, or local taxes may be charged by the destination country.',
    buyerResponsibilityNote:
      'These destination-country charges are usually the buyer’s responsibility unless the seller and buyer agree otherwise.'
  }
}

export default function Checkout() {
  const cartContext = useCart() || {}
  const currencyContext = useCurrency() || {}

  const cartItems = Array.isArray(cartContext.cart) ? cartContext.cart : []

  const currencyCode = currencyContext?.currency?.code || 'USD'

  const formatPrice =
    typeof currencyContext.formatPrice === 'function'
      ? currencyContext.formatPrice
      : (amount) => `$${Number(amount || 0).toFixed(2)}`

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCountry: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotalUSD = useMemo(() => {
    if (typeof cartContext.getCartTotal === 'function') {
      return Number(cartContext.getCartTotal() || 0)
    }

    return cartItems.reduce((sum, item) => {
      return sum + Number(item.priceUSD || 0) * Number(item.quantity || 1)
    }, 0)
  }, [cartContext, cartItems])

  const totalKg = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + getItemWeightKg(item), 0)
  }, [cartItems])

  const estimate = useMemo(() => {
    return calculateShippingAndTax({
      subtotalUSD,
      totalKg,
      country: form.country || form.customerCountry
    })
  }, [subtotalUSD, totalKg, form.country, form.customerCountry])

  const totalUSD = Number((subtotalUSD + estimate.shippingUSD + estimate.taxUSD).toFixed(2))

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function createOrder() {
    setError('')

    if (!cartItems.length) {
      setError('Your cart is empty.')
      return
    }

    if (!form.customerName || !form.customerEmail || !form.country || !form.line1 || !form.city || !form.postalCode) {
      setError('Please fill customer name, email, address, city, postal code, and delivery country.')
      return
    }

    setLoading(true)

    try {
      const body = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        customerCountry: form.country,
        customerAddress: {
          line1: form.line1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country
        },
        items: cartItems,

        subtotalUSD,
        shippingUSD: estimate.shippingUSD,
        taxUSD: estimate.taxUSD,
        totalUSD,

        currencyPaid: currencyCode,
        shippingType: estimate.shippingType,
        totalWeightKg: totalKg,
        customsNote: estimate.customsNote,
        buyerResponsibilityNote: estimate.buyerResponsibilityNote,

        paymentMethod: currencyCode === 'INR' ? 'razorpay' : 'stripe',
        paymentStatus: 'pending',
        orderStatus: 'processing'
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to create order.')
      }

      if (typeof cartContext.clearCart === 'function') {
        cartContext.clearCart()
      }

      window.location.href = `/order-confirmation?order=${data.orderNumber}`
    } catch (err) {
      setError(err.message || 'Unable to create order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ec]">
      <section className="bg-emerald-950 px-4 py-16 text-white">
        <div className="container-premium">
          <p className="badge-premium bg-white/10 text-amber-200 border-amber-300/40">
            Secure Checkout
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
            Checkout with shipping and tax estimate.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50">
            Delivery charges are estimated based on country and order weight. International customs or import taxes may be charged by the destination country.
          </p>
        </div>
      </section>

      <section className="container-premium py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-premium p-6 md:p-8">
            <h2 className="text-3xl font-black text-emerald-950">
              Delivery Details
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="input-premium" placeholder="Customer name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} />
              <input className="input-premium" type="email" placeholder="Customer email" value={form.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} />
              <input className="input-premium" placeholder="Phone number" value={form.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} />
              <input className="input-premium" placeholder="Delivery country, e.g. India, United States" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
              <input className="input-premium md:col-span-2" placeholder="Address line" value={form.line1} onChange={(e) => updateField('line1', e.target.value)} />
              <input className="input-premium" placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              <input className="input-premium" placeholder="State / Province" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              <input className="input-premium" placeholder="Postal / ZIP code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={createOrder}
              disabled={loading}
              className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating Order...' : 'Create Order with Estimate'}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-stone-500">
              This demo creates a pending order. Final live payment collection should be enabled only after confirming shipping, tax, and export settings with the store owner.
            </p>
          </div>

          <aside className="space-y-5">
            <div className="card-premium p-6">
              <h2 className="text-2xl font-black text-emerald-950">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                {cartItems.length ? (
                  cartItems.map((item, index) => (
                    <div key={`${item.productId || index}-${item.variant || index}`} className="flex justify-between gap-4 rounded-2xl bg-white/70 p-3 text-sm">
                      <div>
                        <p className="font-bold text-emerald-950">{item.productName}</p>
                        <p className="text-stone-500">{item.variant} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-emerald-950">
                        {formatPrice(Number(item.priceUSD || 0) * Number(item.quantity || 1))}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500">Your cart is empty.</p>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-emerald-100 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Product subtotal</span>
                  <strong>{formatPrice(subtotalUSD)}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated weight</span>
                  <strong>{totalKg.toFixed(2)} kg</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping type</span>
                  <strong>{estimate.shippingType}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated shipping</span>
                  <strong>{formatPrice(estimate.shippingUSD)}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">
                    {estimate.shippingType === 'India Domestic' ? 'Estimated GST' : 'Customs charged now'}
                  </span>
                  <strong>{formatPrice(estimate.taxUSD)}</strong>
                </div>

                <div className="flex justify-between border-t border-emerald-100 pt-4 text-lg">
                  <span className="font-black text-emerald-950">Estimated total</span>
                  <strong className="text-emerald-950">{formatPrice(totalUSD)}</strong>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="text-xl font-black text-emerald-950">
                Tax & Customs Notice
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {estimate.customsNote}
              </p>
              {estimate.buyerResponsibilityNote && (
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {estimate.buyerResponsibilityNote}
                </p>
              )}
            </div>

            <div className="card-premium p-6">
              <h3 className="text-xl font-black text-emerald-950">
                Payment Preview
              </h3>
              <div className="mt-4">
                {currencyCode === 'INR' ? <RazorpayCheckout /> : <StripeCheckout />}
              </div>
              <p className="mt-4 text-xs leading-6 text-stone-500">
                Payment gateway buttons are preview components. Final payment setup needs real Stripe/Razorpay keys and test transactions.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

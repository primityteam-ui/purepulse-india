'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { currency, formatPrice } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitOrder(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Your cart is empty.')
      return
    }

    setLoading(true)

    try {
      const subtotalUSD = getCartTotal()
      const payload = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        customerCountry: form.country,
        customerAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variant: item.variant,
          quantity: item.quantity,
          priceUSD: item.priceUSD,
          pricePaid: item.priceUSD * currency.rate,
          currencyPaid: currency.code
        })),
        subtotalUSD,
        totalUSD: subtotalUSD,
        totalPaid: subtotalUSD * currency.rate,
        currencyPaid: currency.code,
        paymentMethod: currency.code === 'INR' ? 'razorpay' : 'stripe',
        paymentStatus: 'pending',
        orderStatus: 'processing'
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not create order')
      }

      clearCart()
      router.push(`/order-confirmation?order=${encodeURIComponent(data.order?.orderNumber || '')}`)
    } catch (error) {
      alert(error.message || 'Order failed. Please check your setup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-10">
          <div className="badge-premium mb-4">Secure checkout</div>
          <h1 className="text-5xl font-black text-green-950">Complete your order</h1>
          <p className="mt-4 text-lg text-green-950/60">
            Payment integration will be finalized after the frontend is clean. This creates a real order in MongoDB.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submitOrder} className="card-premium p-6 md:p-8">
            <h2 className="mb-5 text-2xl font-black text-green-950">Customer details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-premium" placeholder="Full name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required />
              <input className="input-premium" type="email" placeholder="Email" value={form.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} required />
              <input className="input-premium" placeholder="Phone" value={form.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} required />
              <input className="input-premium" placeholder="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} required />
            </div>

            <h2 className="mb-5 mt-8 text-2xl font-black text-green-950">Shipping address</h2>

            <div className="grid gap-4">
              <input className="input-premium" placeholder="Address line 1" value={form.line1} onChange={(e) => updateField('line1', e.target.value)} required />
              <input className="input-premium" placeholder="Address line 2" value={form.line2} onChange={(e) => updateField('line2', e.target.value)} />
              <div className="grid gap-4 md:grid-cols-3">
                <input className="input-premium" placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
                <input className="input-premium" placeholder="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} required />
                <input className="input-premium" placeholder="Postal code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} required />
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-green-50 p-5">
              <h3 className="font-black text-green-950">Payment method</h3>
              <p className="mt-2 text-sm leading-6 text-green-950/60">
                Detected currency: <strong>{currency.code}</strong>. Indian customers use Razorpay. Other customers use Stripe.
              </p>
            </div>

            <button disabled={loading} className="btn-primary mt-8 w-full">
              {loading ? 'Creating Order...' : 'Place Order'}
            </button>
          </form>

          <aside className="card-premium h-fit p-6">
            <h2 className="text-2xl font-black text-green-950">Summary</h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="flex justify-between gap-4 border-b border-green-900/10 pb-4">
                  <div>
                    <div className="font-black text-green-950">{item.productName}</div>
                    <div className="text-sm font-bold text-green-950/45">{item.variant} × {item.quantity}</div>
                  </div>
                  <div className="font-black text-green-950">{formatPrice(item.priceUSD * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-xl">
              <span className="font-black text-green-950">Total</span>
              <strong className="text-green-950">{formatPrice(getCartTotal())}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

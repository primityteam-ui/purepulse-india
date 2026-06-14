'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentCancelled, setPaymentCancelled] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPaymentCancelled(params.get('cancelled') === 'true')
  }, [])

  const { cartItems, getCartTotal, clearCart } = useCart()
  const { currency, formatPrice } = useCurrency()

  const [loading, setLoading] = useState(false)
  const [paymentMode, setPaymentMode] = useState('online')
  const [message, setMessage] = useState('')

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

  function buildOrderPayload(paymentMethod = 'pending') {
    const subtotalUSD = getCartTotal()

    return {
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
        quantity: Number(item.quantity || 1),
        priceUSD: Number(item.priceUSD || 0),
        pricePaid: Number(item.priceUSD || 0) * Number(currency.rate || 1),
        currencyPaid: currency.code
      })),
      subtotalUSD,
      totalUSD: subtotalUSD,
      totalPaid: paymentMethod === 'manual' ? 0 : subtotalUSD * Number(currency.rate || 1),
      currencyPaid: currency.code,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      notes:
        paymentMethod === 'manual'
          ? 'Customer requested manual invoice / offline payment follow-up.'
          : 'Customer selected online payment.'
    }
  }

  async function createOrder(paymentMethod) {
    const payload = buildOrderPayload(paymentMethod)

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Could not create order.')
    }

    return data.order
  }

  async function submitOrder(event) {
    event.preventDefault()
    setMessage('')

    if (cartItems.length === 0) {
      setMessage('Your cart is empty. Please add products before checkout.')
      return
    }

    setLoading(true)

    try {
      if (paymentMode === 'manual') {
        const order = await createOrder('manual')
        clearCart()
        router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=manual`)
        return
      }

      const order = await createOrder(currency.code === 'INR' ? 'razorpay' : 'stripe')

      if (currency.code === 'INR') {
        clearCart()
        router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=manual`)
        return
      }

      const stripeResponse = await fetch('/api/payments/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id })
      })

      const stripeData = await stripeResponse.json()

      if (!stripeResponse.ok || !stripeData.success || !stripeData.url) {
        clearCart()
        router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=pending`)
        return
      }

      clearCart()
      window.location.href = stripeData.url
    } catch (error) {
      setMessage(error.message || 'Checkout failed. Please try again.')
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
          <p className="mt-4 max-w-3xl text-lg leading-8 text-green-950/60">
            Enter your delivery details and choose how you want to continue. Online card payment is available when Stripe is configured. Manual invoice is available for export and bulk orders.
          </p>
        </div>

        {paymentCancelled && (
          <div className="mb-6 rounded-3xl bg-yellow-50 p-5 font-bold text-yellow-900">
            Payment was cancelled. You can review your cart and try again.
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-3xl bg-red-50 p-5 font-bold text-red-700">
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <div className="text-6xl">🛒</div>
            <h2 className="mt-5 text-3xl font-black text-green-950">Your cart is empty</h2>
            <p className="mt-3 text-green-950/60">Add products before checkout.</p>
            <Link href="/shop" className="btn-primary mt-7">Shop Products</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
            <form onSubmit={submitOrder} className="card-premium p-6 md:p-8">
              <h2 className="mb-5 text-2xl font-black text-green-950">Customer details</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input className="input-premium" placeholder="Full name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required />
                <input className="input-premium" type="email" placeholder="Email" value={form.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} required />
                <input className="input-premium" placeholder="Phone / WhatsApp" value={form.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} required />
                <input className="input-premium" placeholder="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} required />
              </div>

              <h2 className="mb-5 mt-8 text-2xl font-black text-green-950">Shipping address</h2>

              <div className="grid gap-4">
                <input className="input-premium" placeholder="Address line 1" value={form.line1} onChange={(e) => updateField('line1', e.target.value)} required />
                <input className="input-premium" placeholder="Address line 2" value={form.line2} onChange={(e) => updateField('line2', e.target.value)} />
                <div className="grid gap-4 md:grid-cols-3">
                  <input className="input-premium" placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
                  <input className="input-premium" placeholder="State / Province" value={form.state} onChange={(e) => updateField('state', e.target.value)} required />
                  <input className="input-premium" placeholder="Postal code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} required />
                </div>
              </div>

              <h2 className="mb-5 mt-8 text-2xl font-black text-green-950">Payment option</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={`cursor-pointer rounded-3xl border p-5 ${paymentMode === 'online' ? 'border-green-700 bg-green-50' : 'border-green-950/10 bg-white'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="online"
                    checked={paymentMode === 'online'}
                    onChange={() => setPaymentMode('online')}
                    className="mr-2"
                  />
                  <span className="font-black text-green-950">Pay online</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-green-950/60">
                    Card payment through Stripe when payment keys are configured.
                  </p>
                </label>

                <label className={`cursor-pointer rounded-3xl border p-5 ${paymentMode === 'manual' ? 'border-green-700 bg-green-50' : 'border-green-950/10 bg-white'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="manual"
                    checked={paymentMode === 'manual'}
                    onChange={() => setPaymentMode('manual')}
                    className="mr-2"
                  />
                  <span className="font-black text-green-950">Request invoice</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-green-950/60">
                    Best for export, wholesale, bank transfer, and shipping quote confirmation.
                  </p>
                </label>
              </div>

              <button disabled={loading} className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Processing...' : paymentMode === 'manual' ? 'Submit Order Request' : 'Continue to Payment'}
              </button>
            </form>

            <aside className="card-premium h-fit p-6">
              <h2 className="text-2xl font-black text-green-950">Order summary</h2>

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

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-green-950/65">
                  <span>Subtotal</span>
                  <strong className="text-green-950">{formatPrice(getCartTotal())}</strong>
                </div>
                <div className="flex justify-between text-green-950/65">
                  <span>Shipping</span>
                  <strong className="text-green-950">Confirmed after address</strong>
                </div>
              </div>

              <div className="mt-6 border-t border-green-900/10 pt-6">
                <div className="flex justify-between text-xl">
                  <span className="font-black text-green-950">Total</span>
                  <strong className="text-green-950">{formatPrice(getCartTotal())}</strong>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-green-50 p-5 text-sm font-semibold leading-6 text-green-950/65">
                Your order number will be generated after checkout. You can track your order using your order number and email.
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

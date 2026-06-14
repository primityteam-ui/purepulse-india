'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { currency, formatPrice } = useCurrency()

  const [paymentCancelled, setPaymentCancelled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMode, setPaymentMode] = useState('stripe')
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPaymentCancelled(params.get('cancelled') === 'true')
  }, [])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function buildOrderPayload(paymentMethod = 'pending') {
    const subtotalUSD = getCartTotal()
    const paidCurrency = paymentMethod === 'razorpay' ? 'INR' : currency.code
    const paidTotal =
      paymentMethod === 'manual'
        ? 0
        : subtotalUSD * Number(currency.rate || 1)

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
        currencyPaid: paidCurrency
      })),
      subtotalUSD,
      totalUSD: subtotalUSD,
      totalPaid: paidTotal,
      currencyPaid: paidCurrency,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      notes:
        paymentMethod === 'manual'
          ? 'Customer requested invoice / bank transfer / offline payment follow-up.'
          : paymentMethod === 'razorpay'
            ? 'Customer selected India payment through Razorpay.'
            : 'Customer selected international card payment through Stripe.'
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

  async function payWithStripe(order) {
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
  }

  async function payWithRazorpay(order) {
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      clearCart()
      router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=pending`)
      return
    }

    const amountINR = Number(order.totalPaid || order.totalUSD || 0)

    const razorpayResponse = await fetch('/api/payments/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order._id,
        amountINR
      })
    })

    const razorpayData = await razorpayResponse.json()

    if (!razorpayResponse.ok || !razorpayData.success) {
      clearCart()
      router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=pending`)
      return
    }

    const options = {
      key: razorpayData.keyId,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: 'Farm Origin',
      description: `Order ${order.orderNumber}`,
      order_id: razorpayData.razorpayOrderId,
      prefill: {
        name: form.customerName,
        email: form.customerEmail,
        contact: form.customerPhone
      },
      notes: {
        appOrderId: order._id,
        orderNumber: order.orderNumber
      },
      handler: async function (response) {
        const verifyResponse = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appOrderId: order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        })

        const verifyData = await verifyResponse.json()

        clearCart()

        if (verifyResponse.ok && verifyData.success) {
          router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&paid=success`)
        } else {
          router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=pending`)
        }
      },
      modal: {
        ondismiss: function () {
          router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}&payment=pending`)
        }
      },
      theme: {
        color: '#166534'
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
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

      if (paymentMode === 'razorpay') {
        const order = await createOrder('razorpay')
        await payWithRazorpay(order)
        return
      }

      const order = await createOrder('stripe')
      await payWithStripe(order)
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
            Farm Origin supports international card payments, India UPI/card payments, and manual invoice requests for export and wholesale orders.
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

              <div className="grid gap-4">
                <label className={`cursor-pointer rounded-3xl border p-5 ${paymentMode === 'stripe' ? 'border-green-700 bg-green-50' : 'border-green-950/10 bg-white'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="stripe"
                    checked={paymentMode === 'stripe'}
                    onChange={() => setPaymentMode('stripe')}
                    className="mr-2"
                  />
                  <span className="font-black text-green-950">International card payment</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-green-950/60">
                    Accept international debit cards, credit cards, and supported Stripe payment methods when the client connects a Stripe merchant account.
                  </p>
                </label>

                <label className={`cursor-pointer rounded-3xl border p-5 ${paymentMode === 'razorpay' ? 'border-green-700 bg-green-50' : 'border-green-950/10 bg-white'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="razorpay"
                    checked={paymentMode === 'razorpay'}
                    onChange={() => setPaymentMode('razorpay')}
                    className="mr-2"
                  />
                  <span className="font-black text-green-950">India UPI / PhonePe / cards</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-green-950/60">
                    Accept UPI apps including PhonePe, debit cards, credit cards, net banking, and wallets through Razorpay after the client connects Razorpay live keys.
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
                  <span className="font-black text-green-950">Request invoice / bank transfer</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-green-950/60">
                    Best for wholesale, export orders, large quantity deals, bank transfer, shipping quotes, and manual payment confirmation.
                  </p>
                </label>
              </div>

              <button disabled={loading} className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {loading
                  ? 'Processing...'
                  : paymentMode === 'manual'
                    ? 'Submit Order Request'
                    : paymentMode === 'razorpay'
                      ? 'Pay with UPI / PhonePe / Cards'
                      : 'Pay with International Card'}
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
                Orders are saved in the admin dashboard immediately. Online payments are marked paid after payment gateway confirmation.
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

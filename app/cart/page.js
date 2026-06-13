'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { formatPrice } = useCurrency()

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-10">
          <div className="badge-premium mb-4">Your cart</div>
          <h1 className="text-5xl font-black text-green-950">Review your order</h1>
          <p className="mt-4 text-lg text-green-950/60">
            Check your products before moving to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <div className="text-6xl">🛒</div>
            <h2 className="mt-5 text-3xl font-black text-green-950">Your cart is empty</h2>
            <p className="mt-3 text-green-950/60">Add organic pulses from the shop page.</p>
            <Link href="/shop" className="btn-primary mt-7">Shop Products</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="card-premium flex flex-col gap-5 p-5 md:flex-row md:items-center">
                  <div className="product-image-fallback grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-4xl">🌱</div>

                  <div className="flex-1">
                    <h3 className="text-xl font-black text-green-950">{item.productName}</h3>
                    <p className="mt-1 text-sm font-bold text-green-950/50">{item.variant}</p>
                    <p className="mt-2 font-black text-green-950">{formatPrice(item.priceUSD)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, item.variant, event.target.value)}
                      className="input-premium w-24 text-center font-black"
                    />
                    <button
                      onClick={() => removeFromCart(item.productId, item.variant)}
                      className="rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card-premium h-fit p-6">
              <h2 className="text-2xl font-black text-green-950">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-green-950/65">
                  <span>Subtotal</span>
                  <strong className="text-green-950">{formatPrice(getCartTotal())}</strong>
                </div>
                <div className="flex justify-between text-green-950/65">
                  <span>Shipping</span>
                  <strong className="text-green-950">Calculated after address</strong>
                </div>
              </div>

              <div className="mt-6 border-t border-green-900/10 pt-6">
                <div className="flex justify-between text-lg">
                  <span className="font-black text-green-950">Total</span>
                  <strong className="text-green-950">{formatPrice(getCartTotal())}</strong>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary mt-7 w-full">
                Continue to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

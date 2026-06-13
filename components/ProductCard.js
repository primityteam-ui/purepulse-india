'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  const price = product?.variants?.['1kg'] || product?.priceUSD || 0

  function handleAdd() {
    addToCart({
      productId: product._id,
      productName: product.name,
      variant: '1kg',
      quantity: 1,
      priceUSD: price
    })
  }

  return (
    <article className="group card-premium overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative p-4">
          <div className="product-image-fallback flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.4rem]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl">🌱</div>
                <div className="mt-3 text-sm font-black text-green-950/50">Organic Pulse</div>
              </div>
            )}
          </div>

          {product.badge ? (
            <span className="absolute left-7 top-7 rounded-full bg-[#d8a441] px-3 py-1 text-xs font-black text-green-950 shadow-lg">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="px-5 pb-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-green-700/70">
            {product.category}
          </div>
          <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-black leading-tight text-green-950">
            {product.name}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-green-950/58">
            {product.description}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-green-950/45">1kg starts at</div>
              <div className="text-lg font-black text-green-950">{formatPrice(price)}</div>
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-800">
              In stock
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-3 border-t border-green-900/10 p-5 pt-4">
        <button onClick={handleAdd} className="btn-primary flex-1 text-sm">
          Add to Cart
        </button>
        <Link href={`/product/${product._id}`} className="btn-secondary flex-1 text-sm">
          Details
        </Link>
      </div>
    </article>
  )
}
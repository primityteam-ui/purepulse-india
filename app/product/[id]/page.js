'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/hooks/useCurrency'
import NegotiationChat from '@/components/NegotiationChat'

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [variant, setVariant] = useState('1kg')
  const [quantity, setQuantity] = useState(1)
  const [negotiationOpen, setNegotiationOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        const loadedProduct = data.product || data
        setProduct(loadedProduct)

        const allResponse = await fetch('/api/products')
        const allData = await allResponse.json()
        const sameCategory = (allData.products || [])
          .filter((item) => item.category === loadedProduct.category && item._id !== loadedProduct._id)
          .slice(0, 4)
        setRelated(sameCategory)

        const firstVariant = Object.keys(loadedProduct.variants || {})[0] || '1kg'
        setVariant(firstVariant)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) loadProduct()
  }, [params.id])

  const selectedPrice = useMemo(() => {
    if (!product) return 0
    return Number(product.variants?.[variant] || product.priceUSD || 0)
  }, [product, variant])

  function handleAddToCart() {
    if (!product) return

    addToCart({
      productId: product._id,
      productName: product.name,
      variant,
      quantity,
      priceUSD: selectedPrice
    })
  }

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-premium">
          <div className="card-premium p-12 text-center font-black text-green-950">Loading product...</div>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="section-padding">
        <div className="container-premium">
          <div className="card-premium p-12 text-center">
            <h1 className="text-3xl font-black text-green-950">Product not found</h1>
            <Link href="/shop" className="btn-primary mt-6">Back to Shop</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div>
      <section className="bg-green-950 py-10 text-white">
        <div className="container-premium">
          <Link href="/shop" className="text-sm font-bold text-white/60 hover:text-white">← Back to shop</Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card-premium p-5">
              <div className="product-image-fallback flex aspect-square items-center justify-center overflow-hidden rounded-[1.7rem]">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-8xl">🌱</div>
                    <div className="mt-4 text-xl font-black text-green-950/50">Organic Pulse</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-3">
                {product.badge ? <span className="badge-premium">{product.badge}</span> : null}
                <span className="badge-premium">{product.category}</span>
                <span className="badge-premium">Origin: {product.origin}</span>
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-green-950 md:text-6xl">
                {product.name}
              </h1>

              <p className="mt-6 text-lg leading-8 text-green-950/65">{product.description}</p>

              <div className="mt-8 rounded-3xl border border-green-900/10 bg-white p-6">
                <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-green-800/65">
                  Select pack size
                </div>

                <div className="flex flex-wrap gap-3">
                  {Object.keys(product.variants || {}).map((item) => (
                    <button
                      key={item}
                      onClick={() => setVariant(item)}
                      className={`rounded-2xl px-5 py-3 font-black ${
                        variant === item
                          ? 'bg-green-950 text-white'
                          : 'border border-green-900/10 bg-green-50 text-green-950'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-bold text-green-950/50">Selected price</div>
                    <div className="text-4xl font-black text-green-950">{formatPrice(selectedPrice)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      className="input-premium w-24 text-center font-black"
                    />
                    <button onClick={handleAddToCart} className="btn-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={() => setNegotiationOpen(true)} className="btn-secondary mt-5 w-full">
                Negotiate Price for 25kg+ Bulk Order
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="card-premium p-8">
              <h2 className="text-2xl font-black text-green-950">Health Benefits</h2>
              <p className="mt-4 leading-8 text-green-950/65">{product.healthBenefits}</p>
            </div>

            <div className="card-premium p-8">
              <h2 className="text-2xl font-black text-green-950">Nutrition per 100g</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                {Object.entries(product.nutritionPer100g || {}).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-green-50 p-4 text-center">
                    <div className="text-xl font-black text-green-950">{value}</div>
                    <div className="text-xs font-bold capitalize text-green-950/50">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 card-premium p-8">
            <h2 className="text-2xl font-black text-green-950">Certifications</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {(product.certifications || []).map((certification) => (
                <span key={certification} className="rounded-full bg-green-950 px-5 py-3 text-sm font-black text-white">
                  {certification}
                </span>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 text-3xl font-black text-green-950">Related products</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link key={item._id} href={`/product/${item._id}`} className="card-premium block p-5 transition hover:-translate-y-1">
                    <div className="product-image-fallback mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl text-5xl">🌱</div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-green-700/70">{item.category}</div>
                    <h3 className="mt-2 font-black text-green-950">{item.name}</h3>
                    <p className="mt-2 text-sm font-bold text-green-950/55">{formatPrice(item.priceUSD)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {negotiationOpen && (
        <NegotiationChat product={product} onClose={() => setNegotiationOpen(false)} />
      )}
    </div>
  )
}

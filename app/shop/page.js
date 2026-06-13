'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductGrid from '@/components/ProductGrid'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))]
  }, [products])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (category !== 'All') {
      list = list.filter((product) => product.category === category)
    }

    if (sort === 'low') {
      list.sort((a, b) => Number(a.priceUSD || 0) - Number(b.priceUSD || 0))
    }

    if (sort === 'high') {
      list.sort((a, b) => Number(b.priceUSD || 0) - Number(a.priceUSD || 0))
    }

    if (sort === 'featured') {
      list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    }

    return list
  }, [products, category, sort])

  return (
    <div>
      <section className="bg-green-950 py-20 text-white">
        <div className="container-premium">
          <div className="badge-premium mb-5 bg-white/10 text-[#f1cf75]">Shop organic Indian pulses</div>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
            Clean, premium pulses for daily cooking and bulk buying.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Choose from lentils, chickpeas, beans, peas, and rare Indian superfoods. Every product is made to feel trustworthy, modern, and export-ready.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-5 py-3 text-sm font-black transition ${
                    category === item
                      ? 'bg-green-950 text-white'
                      : 'border border-green-900/10 bg-white text-green-950 hover:border-green-900/25'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="input-premium max-w-xs font-bold"
            >
              <option value="featured">Sort by Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="card-premium p-12 text-center">
              <div className="text-4xl">🌱</div>
              <p className="mt-4 font-black text-green-950">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </section>
    </div>
  )
}

import ProductCard from '@/components/ProductCard'

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="card-premium p-10 text-center">
        <div className="text-4xl">🌱</div>
        <h3 className="mt-4 text-2xl font-black text-green-950">No products found</h3>
        <p className="mt-2 text-green-950/60">Please seed products or try another category.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
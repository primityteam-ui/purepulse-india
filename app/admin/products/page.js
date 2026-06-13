'use client'

import { useEffect, useMemo, useState } from 'react'

const emptyProduct = {
  name: '',
  category: 'Lentils',
  description: '',
  healthBenefits: '',
  origin: '',
  badge: '',
  inStock: true,
  featured: false,
  image: '',
  priceUSD: 1,
  variants: {
    '500g': 1,
    '1kg': 1,
    '5kg': 5,
    '25kg': 20,
    '50kg': 40
  },
  nutritionPer100g: {
    protein: 0,
    carbohydrates: 0,
    fiber: 0,
    fat: 0,
    calories: 0
  },
  certifications: ['FSSAI', 'USDA Organic', 'EU Organic', 'Lab Tested']
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)

    try {
      const response = await fetch('/api/products', { cache: 'no-store' })
      const data = await response.json()
      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return products

    return products.filter((product) =>
      `${product.name} ${product.category} ${product.badge}`.toLowerCase().includes(value)
    )
  }, [products, search])

  function startEdit(product) {
    setSelectedProduct(product)
    setForm({
      ...emptyProduct,
      ...product,
      variants: {
        ...emptyProduct.variants,
        ...(product.variants || {})
      },
      nutritionPer100g: {
        ...emptyProduct.nutritionPer100g,
        ...(product.nutritionPer100g || {})
      },
      certifications: product.certifications || []
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startNewProduct() {
    setSelectedProduct(null)
    setForm(emptyProduct)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  function updateVariant(name, value) {
    setForm((current) => ({
      ...current,
      variants: {
        ...current.variants,
        [name]: Number(value)
      }
    }))
  }

  function updateNutrition(name, value) {
    setForm((current) => ({
      ...current,
      nutritionPer100g: {
        ...current.nutritionPer100g,
        [name]: Number(value)
      }
    }))
  }

  function updateCertifications(value) {
    const certifications = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    setForm((current) => ({
      ...current,
      certifications
    }))
  }

  async function uploadImage(file) {
    if (!file) return

    setUploading(true)
    setMessage('Uploading image...')

    try {
      const base64 = await fileToBase64(file)

      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      updateField('image', data.url)
      setMessage('Image uploaded. Click Save Product to store it.')
    } catch (error) {
      setMessage(error.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function saveProduct(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('Saving product...')

    try {
      const payload = {
        ...form,
        priceUSD: Number(form.priceUSD),
        variants: Object.fromEntries(
          Object.entries(form.variants || {}).map(([key, value]) => [key, Number(value)])
        )
      }

      const url = selectedProduct?._id
        ? `/api/products/${selectedProduct._id}`
        : '/api/products'

      const method = selectedProduct?._id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Save failed')
      }

      setMessage('Product saved successfully.')
      await loadProducts()
      setSelectedProduct(data.product)
    } catch (error) {
      setMessage(error.message || 'Could not save product')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`)

    if (!confirmed) return

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed')
      }

      if (selectedProduct?._id === product._id) {
        startNewProduct()
      }

      await loadProducts()
      setMessage('Product deleted.')
    } catch (error) {
      setMessage(error.message || 'Could not delete product')
    }
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">Store Owner Panel</div>
            <h1 className="text-5xl font-black text-green-950">Edit Products Daily</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Change prices, stock, badges, featured status, descriptions, and images anytime.
            </p>
          </div>

          <button onClick={startNewProduct} className="btn-primary">
            Add New Product
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 font-bold text-green-950">
            {message}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1fr_1.15fr]">
          <form onSubmit={saveProduct} className="card-premium h-fit p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black text-green-950">
                {selectedProduct?._id ? 'Edit Product' : 'Add Product'}
              </h2>
              {selectedProduct?._id && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-800">
                  Editing
                </span>
              )}
            </div>

            <div className="grid gap-4">
              <input
                className="input-premium"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="input-premium"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  <option>Lentils</option>
                  <option>Chickpeas</option>
                  <option>Beans</option>
                  <option>Peas</option>
                  <option>Special</option>
                </select>

                <input
                  className="input-premium"
                  placeholder="Badge"
                  value={form.badge}
                  onChange={(e) => updateField('badge', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="input-premium"
                  placeholder="Origin"
                  value={form.origin}
                  onChange={(e) => updateField('origin', e.target.value)}
                />

                <input
                  className="input-premium"
                  type="number"
                  step="0.01"
                  placeholder="Base price USD"
                  value={form.priceUSD}
                  onChange={(e) => updateField('priceUSD', Number(e.target.value))}
                />
              </div>

              <textarea
                className="input-premium min-h-28"
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />

              <textarea
                className="input-premium min-h-24"
                placeholder="Health benefits"
                value={form.healthBenefits}
                onChange={(e) => updateField('healthBenefits', e.target.value)}
              />

              <div className="rounded-3xl bg-green-50 p-5">
                <h3 className="mb-4 text-xl font-black text-green-950">Prices by pack size</h3>

                <div className="grid gap-4 md:grid-cols-3">
                  {['500g', '1kg', '3kg', '5kg', '25kg', '50kg'].map((variant) => (
                    <label key={variant} className="block">
                      <span className="mb-2 block text-sm font-black text-green-950/60">
                        {variant} USD
                      </span>
                      <input
                        className="input-premium"
                        type="number"
                        step="0.01"
                        value={form.variants?.[variant] ?? ''}
                        onChange={(e) => updateVariant(variant, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#fff7df] p-5">
                <h3 className="mb-4 text-xl font-black text-green-950">Product Image</h3>

                <div className="mb-4 overflow-hidden rounded-3xl border border-green-900/10 bg-white">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={form.name || 'Product image'}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-64 place-items-center text-green-950/50">
                      No image selected
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="input-premium"
                  onChange={(e) => uploadImage(e.target.files?.[0])}
                  disabled={uploading}
                />

                <input
                  className="input-premium mt-4"
                  placeholder="Or paste image URL"
                  value={form.image}
                  onChange={(e) => updateField('image', e.target.value)}
                />

                <p className="mt-3 text-sm font-semibold text-green-950/55">
                  Upload an image from your computer or paste a Cloudinary/supplier image URL.
                </p>
              </div>

              <div className="rounded-3xl bg-green-50 p-5">
                <h3 className="mb-4 text-xl font-black text-green-950">Nutrition per 100g</h3>

                <div className="grid gap-4 md:grid-cols-5">
                  {['protein', 'carbohydrates', 'fiber', 'fat', 'calories'].map((field) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-sm font-black capitalize text-green-950/60">
                        {field}
                      </span>
                      <input
                        className="input-premium"
                        type="number"
                        step="0.01"
                        value={form.nutritionPer100g?.[field] ?? 0}
                        onChange={(e) => updateNutrition(field, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <input
                className="input-premium"
                placeholder="Certifications comma separated"
                value={(form.certifications || []).join(', ')}
                onChange={(e) => updateCertifications(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 font-black text-green-950">
                  <input
                    type="checkbox"
                    checked={Boolean(form.inStock)}
                    onChange={(e) => updateField('inStock', e.target.checked)}
                  />
                  In Stock
                </label>

                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 font-black text-green-950">
                  <input
                    type="checkbox"
                    checked={Boolean(form.featured)}
                    onChange={(e) => updateField('featured', e.target.checked)}
                  />
                  Featured
                </label>
              </div>

              <button disabled={saving || uploading} className="btn-primary w-full">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>

          <div>
            <div className="card-premium mb-5 p-5">
              <input
                className="input-premium"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="card-premium overflow-hidden">
              <div className="border-b border-green-900/10 p-5">
                <h2 className="text-2xl font-black text-green-950">
                  Products {loading ? '' : `(${filteredProducts.length})`}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-left text-sm text-green-950/60">
                      <th className="p-4 font-black">Image</th>
                      <th className="p-4 font-black">Name</th>
                      <th className="p-4 font-black">Category</th>
                      <th className="p-4 font-black">1kg</th>
                      <th className="p-4 font-black">25kg</th>
                      <th className="p-4 font-black">Stock</th>
                      <th className="p-4 font-black">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-t border-green-900/10">
                        <td className="p-4">
                          <div className="h-16 w-20 overflow-hidden rounded-2xl bg-green-50">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-green-950">{product.name}</div>
                          <div className="text-xs font-bold text-green-950/45">{product.badge || 'No badge'}</div>
                        </td>

                        <td className="p-4 font-bold text-green-950/70">{product.category}</td>

                        <td className="p-4 font-black text-green-950">
                          ${Number(product.variants?.['1kg'] || product.priceUSD || 0).toFixed(2)}
                        </td>

                        <td className="p-4 font-black text-green-950">
                          ${Number(product.variants?.['25kg'] || 0).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="rounded-full bg-green-950 px-4 py-2 text-sm font-black text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteProduct(product)}
                              className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-10 text-center font-black text-green-950/50">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-green-950 p-5 text-white">
              <h3 className="font-black">Daily owner workflow</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Click Edit, change prices or upload a new product image, then Save Product. Your public shop updates from MongoDB immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

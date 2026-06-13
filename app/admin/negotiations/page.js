'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const statuses = ['pending', 'accepted', 'rejected', 'converted_to_order', 'counter', 'minimum_not_met']

export default function AdminNegotiationsPage() {
  const [negotiations, setNegotiations] = useState([])
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [form, setForm] = useState({
    status: 'pending',
    finalAgreedPriceUSD: '',
    adminNotes: ''
  })
  const [convertForm, setConvertForm] = useState({
    customerPhone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [converting, setConverting] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadNegotiations()
  }, [])

  async function loadNegotiations() {
    setLoading(true)

    try {
      const response = await fetch('/api/negotiations', { cache: 'no-store' })
      const data = await response.json()
      setNegotiations(Array.isArray(data.negotiations) ? data.negotiations : [])
    } catch {
      setNegotiations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredNegotiations = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return negotiations

    return negotiations.filter((item) =>
      `${item.productName} ${item.customerName} ${item.customerEmail} ${item.customerCountry} ${item.status}`
        .toLowerCase()
        .includes(value)
    )
  }, [negotiations, search])

  const totals = useMemo(() => {
    return {
      total: negotiations.length,
      pending: negotiations.filter((item) => item.status === 'pending').length,
      accepted: negotiations.filter((item) => item.status === 'accepted').length,
      converted: negotiations.filter((item) => item.status === 'converted_to_order').length
    }
  }, [negotiations])

  function openNegotiation(negotiation) {
    setSelectedNegotiation(negotiation)
    setForm({
      status: negotiation.status || 'pending',
      finalAgreedPriceUSD: negotiation.finalAgreedPriceUSD ?? '',
      adminNotes: negotiation.adminNotes || ''
    })
    setConvertForm({
      customerPhone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: negotiation.customerCountry || ''
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  function updateConvertField(name, value) {
    setConvertForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function saveNegotiation(event) {
    event.preventDefault()

    if (!selectedNegotiation?._id) {
      setMessage('Select a negotiation first.')
      return
    }

    setSaving(true)
    setMessage('Saving negotiation...')

    try {
      const response = await fetch(`/api/negotiations/${selectedNegotiation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not save negotiation')
      }

      setSelectedNegotiation(data.negotiation)
      setMessage('Negotiation saved successfully.')
      await loadNegotiations()
    } catch (error) {
      setMessage(error.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function convertToOrder() {
    if (!selectedNegotiation?._id) {
      setMessage('Select a negotiation first.')
      return
    }

    const confirmed = window.confirm('Convert this negotiation into a manual order?')

    if (!confirmed) return

    setConverting(true)
    setMessage('Converting negotiation to order...')

    try {
      const response = await fetch(`/api/negotiations/${selectedNegotiation._id}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(convertForm)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not convert to order')
      }

      setSelectedNegotiation(data.negotiation)
      setMessage(`Converted to order ${data.order.orderNumber}. Go to Admin Orders to manage it.`)
      await loadNegotiations()
    } catch (error) {
      setMessage(error.message || 'Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  function statusClass(status) {
    if (status === 'accepted' || status === 'converted_to_order') return 'bg-green-100 text-green-800'
    if (status === 'rejected' || status === 'minimum_not_met') return 'bg-red-100 text-red-700'
    if (status === 'counter') return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  function formatDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">Admin Negotiations</div>
            <h1 className="text-5xl font-black text-green-950">Manage Bulk Price Offers</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Review customer offers, accept or reject deals, add notes, and convert accepted offers into orders.
            </p>
          </div>

          <Link href="/admin" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-3xl bg-green-50 p-5 font-bold text-green-950">
            {message}
          </div>
        )}

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Total Offers</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.total}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Pending</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.pending}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Accepted</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.accepted}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Converted</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.converted}</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_1.15fr]">
          <form onSubmit={saveNegotiation} className="card-premium h-fit p-6 md:p-8">
            <h2 className="mb-6 text-3xl font-black text-green-950">
              {selectedNegotiation ? `Edit Offer` : 'Select an Offer'}
            </h2>

            {!selectedNegotiation ? (
              <div className="rounded-3xl bg-green-50 p-6 text-green-950/65">
                Click an offer from the table to view and manage it.
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-950">Customer</h3>
                  <div className="mt-3 space-y-1 text-sm font-semibold text-green-950/65">
                    <p><strong>Name:</strong> {selectedNegotiation.customerName}</p>
                    <p><strong>Email:</strong> {selectedNegotiation.customerEmail}</p>
                    <p><strong>Country:</strong> {selectedNegotiation.customerCountry || '-'}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#fff7df] p-5">
                  <h3 className="text-xl font-black text-green-950">Offer Details</h3>
                  <div className="mt-3 space-y-2 text-sm font-semibold text-green-950/70">
                    <p><strong>Product:</strong> {selectedNegotiation.productName}</p>
                    <p><strong>Quantity:</strong> {selectedNegotiation.quantityKg}kg</p>
                    <p><strong>Listed Price:</strong> ${Number(selectedNegotiation.listedPriceUSD || 0).toFixed(2)}/kg</p>
                    <p><strong>Customer Offer:</strong> ${Number(selectedNegotiation.offeredPriceUSD || 0).toFixed(2)}/kg</p>
                    <p><strong>Bot Reply:</strong> {selectedNegotiation.botReply || '-'}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">Status</span>
                    <select
                      className="input-premium"
                      value={form.status}
                      onChange={(e) => updateField('status', e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">
                      Final agreed price USD/kg
                    </span>
                    <input
                      className="input-premium"
                      type="number"
                      step="0.01"
                      value={form.finalAgreedPriceUSD}
                      onChange={(e) => updateField('finalAgreedPriceUSD', e.target.value)}
                    />
                  </label>
                </div>

                <textarea
                  className="input-premium min-h-28"
                  placeholder="Admin notes"
                  value={form.adminNotes}
                  onChange={(e) => updateField('adminNotes', e.target.value)}
                />

                <button disabled={saving} className="btn-primary w-full">
                  {saving ? 'Saving...' : 'Save Negotiation'}
                </button>

                <div className="rounded-3xl border border-green-900/10 bg-white p-5">
                  <h3 className="text-xl font-black text-green-950">Convert to Manual Order</h3>
                  <p className="mt-2 text-sm leading-6 text-green-950/60">
                    Use this after the customer accepts the deal. The order will appear in Admin Orders.
                  </p>

                  <div className="mt-5 grid gap-4">
                    <input
                      className="input-premium"
                      placeholder="Customer phone"
                      value={convertForm.customerPhone}
                      onChange={(e) => updateConvertField('customerPhone', e.target.value)}
                    />

                    <input
                      className="input-premium"
                      placeholder="Address line 1"
                      value={convertForm.line1}
                      onChange={(e) => updateConvertField('line1', e.target.value)}
                    />

                    <input
                      className="input-premium"
                      placeholder="Address line 2"
                      value={convertForm.line2}
                      onChange={(e) => updateConvertField('line2', e.target.value)}
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                      <input
                        className="input-premium"
                        placeholder="City"
                        value={convertForm.city}
                        onChange={(e) => updateConvertField('city', e.target.value)}
                      />

                      <input
                        className="input-premium"
                        placeholder="State"
                        value={convertForm.state}
                        onChange={(e) => updateConvertField('state', e.target.value)}
                      />

                      <input
                        className="input-premium"
                        placeholder="Postal code"
                        value={convertForm.postalCode}
                        onChange={(e) => updateConvertField('postalCode', e.target.value)}
                      />
                    </div>

                    <input
                      className="input-premium"
                      placeholder="Country"
                      value={convertForm.country}
                      onChange={(e) => updateConvertField('country', e.target.value)}
                    />

                    <button
                      type="button"
                      disabled={converting}
                      onClick={convertToOrder}
                      className="btn-secondary w-full"
                    >
                      {converting ? 'Converting...' : 'Convert to Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div>
            <div className="card-premium mb-5 p-5">
              <input
                className="input-premium"
                placeholder="Search offers by product, customer, email, country, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="card-premium overflow-hidden">
              <div className="border-b border-green-900/10 p-5">
                <h2 className="text-2xl font-black text-green-950">
                  Offers {loading ? '' : `(${filteredNegotiations.length})`}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-left text-sm text-green-950/60">
                      <th className="p-4 font-black">Product</th>
                      <th className="p-4 font-black">Customer</th>
                      <th className="p-4 font-black">Country</th>
                      <th className="p-4 font-black">Qty</th>
                      <th className="p-4 font-black">Offer</th>
                      <th className="p-4 font-black">Listed</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 font-black">Date</th>
                      <th className="p-4 font-black">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredNegotiations.map((item) => (
                      <tr key={item._id} className="border-t border-green-900/10">
                        <td className="p-4">
                          <div className="font-black text-green-950">{item.productName}</div>
                          <div className="text-xs font-bold text-green-950/45">
                            Final: {item.finalAgreedPriceUSD ? `$${Number(item.finalAgreedPriceUSD).toFixed(2)}/kg` : '-'}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-green-950">{item.customerName}</div>
                          <div className="text-xs font-bold text-green-950/45">{item.customerEmail}</div>
                        </td>

                        <td className="p-4 font-bold text-green-950/65">{item.customerCountry || '-'}</td>

                        <td className="p-4 font-black text-green-950">{Number(item.quantityKg || 0)}kg</td>

                        <td className="p-4 font-black text-green-950">
                          ${Number(item.offeredPriceUSD || 0).toFixed(2)}
                        </td>

                        <td className="p-4 font-black text-green-950">
                          ${Number(item.listedPriceUSD || 0).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="p-4 text-sm font-bold text-green-950/55">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => openNegotiation(item)}
                            className="rounded-full bg-green-950 px-4 py-2 text-sm font-black text-white"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredNegotiations.length === 0 && (
                      <tr>
                        <td colSpan="9" className="p-10 text-center font-black text-green-950/50">
                          No negotiation offers found.
                        </td>
                      </tr>
                    )}

                    {loading && (
                      <tr>
                        <td colSpan="9" className="p-10 text-center font-black text-green-950/50">
                          Loading negotiation offers...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-green-950 p-5 text-white">
              <h3 className="font-black">Business workflow</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Customer negotiates bulk price → owner reviews offer here → owner accepts/rejects → accepted deal can be converted into a manual order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const statuses = ['pending', 'counter', 'accepted', 'rejected', 'minimum_not_met', 'converted_to_order']

export default function AdminNegotiationsPage() {
  const [negotiations, setNegotiations] = useState([])
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [form, setForm] = useState({
    status: 'pending',
    finalAgreedPriceUSD: '',
    adminReply: '',
    adminNotes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      counter: negotiations.filter((item) => item.status === 'counter').length,
      accepted: negotiations.filter((item) => item.status === 'accepted').length
    }
  }, [negotiations])

  function openNegotiation(negotiation) {
    setSelectedNegotiation(negotiation)
    setForm({
      status: negotiation.status || 'pending',
      finalAgreedPriceUSD: negotiation.finalAgreedPriceUSD ?? '',
      adminReply: negotiation.adminReply || '',
      adminNotes: negotiation.adminNotes || ''
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

  async function saveNegotiation(event) {
    event.preventDefault()

    if (!selectedNegotiation?._id) {
      setMessage('Select a request first.')
      return
    }

    setSaving(true)
    setMessage('Saving store owner response...')

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
        throw new Error(data.error || 'Could not save response.')
      }

      setSelectedNegotiation(data.negotiation)
      setMessage(data.message || 'Store owner response saved successfully.')
      await loadNegotiations()
    } catch (error) {
      setMessage(error.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  function statusClass(status) {
    if (status === 'accepted' || status === 'converted_to_order') return 'bg-green-100 text-green-800'
    if (status === 'rejected' || status === 'minimum_not_met') return 'bg-red-100 text-red-700'
    if (status === 'counter') return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  function statusLabel(status) {
    return String(status || 'pending').replaceAll('_', ' ')
  }

  function formatMoney(value) {
    const number = Number(value || 0)
    return `$${number.toFixed(2)}`
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
            <h1 className="text-5xl font-black text-green-950">Manage Bulk Price Requests</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Review customer offers, send a counter price, accept, reject, and keep internal notes.
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
            <div className="text-sm font-black text-green-950/50">Total Requests</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.total}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Pending</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.pending}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Counter Sent</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.counter}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Accepted</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.accepted}</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
          <form onSubmit={saveNegotiation} className="card-premium h-fit p-6 md:p-8">
            <h2 className="mb-6 text-3xl font-black text-green-950">
              {selectedNegotiation ? 'Respond to Customer Offer' : 'Select a Request'}
            </h2>

            {!selectedNegotiation ? (
              <div className="rounded-3xl bg-green-50 p-6 font-semibold text-green-950/65">
                Click any request from the table to view details and respond.
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-950">Customer</h3>
                  <div className="mt-3 space-y-1 text-sm font-semibold text-green-950/70">
                    <p><strong>Name:</strong> {selectedNegotiation.customerName}</p>
                    <p><strong>Email:</strong> {selectedNegotiation.customerEmail}</p>
                    <p><strong>Country:</strong> {selectedNegotiation.customerCountry || '-'}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#fff7df] p-5">
                  <h3 className="text-xl font-black text-green-950">Request Details</h3>
                  <div className="mt-3 space-y-2 text-sm font-semibold text-green-950/70">
                    <p><strong>Product:</strong> {selectedNegotiation.productName}</p>
                    <p><strong>Variant:</strong> {selectedNegotiation.variant || '-'}</p>
                    <p><strong>Quantity:</strong> {selectedNegotiation.quantityKg}kg</p>
                    <p><strong>Customer Offer:</strong> {formatMoney(selectedNegotiation.offeredPriceUSD)}</p>
                    <p><strong>Listed Estimate:</strong> {formatMoney(selectedNegotiation.listedPriceUSD)}</p>
                    <p><strong>Customer Message:</strong> {selectedNegotiation.message || '-'}</p>
                  </div>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-green-950">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) => updateField('status', event.target.value)}
                    className="rounded-2xl border border-green-950/10 bg-white px-4 py-3 font-semibold text-green-950 outline-none"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-green-950">Final or Counter Price USD</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.finalAgreedPriceUSD}
                    onChange={(event) => updateField('finalAgreedPriceUSD', event.target.value)}
                    className="rounded-2xl border border-green-950/10 bg-white px-4 py-3 font-semibold text-green-950 outline-none"
                    placeholder="Example: 1500"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-green-950">Message to Customer</span>
                  <textarea
                    rows={5}
                    value={form.adminReply}
                    onChange={(event) => updateField('adminReply', event.target.value)}
                    className="rounded-2xl border border-green-950/10 bg-white px-4 py-3 font-semibold text-green-950 outline-none"
                    placeholder="Example: We can offer this quantity at $1.45/kg. Please confirm your delivery location and timeline."
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-green-950">Internal Admin Notes</span>
                  <textarea
                    rows={4}
                    value={form.adminNotes}
                    onChange={(event) => updateField('adminNotes', event.target.value)}
                    className="rounded-2xl border border-green-950/10 bg-white px-4 py-3 font-semibold text-green-950 outline-none"
                    placeholder="Private note for store owner/admin only."
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Store Owner Response'}
                </button>
              </div>
            )}
          </form>

          <div className="card-premium overflow-hidden">
            <div className="border-b border-green-950/10 p-5">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-green-950/10 bg-white px-4 py-3 font-semibold text-green-950 outline-none"
                placeholder="Search by product, customer, email, country, or status"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-green-50 text-sm font-black text-green-950/65">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Offer</th>
                    <th className="p-4">Listed</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-green-950/10">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="p-6 text-center font-bold text-green-950/60">
                        Loading requests...
                      </td>
                    </tr>
                  ) : filteredNegotiations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-6 text-center font-bold text-green-950/60">
                        No bulk price requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredNegotiations.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => openNegotiation(item)}
                        className="cursor-pointer transition hover:bg-green-50/70"
                      >
                        <td className="p-4 font-black text-green-950">
                          {item.productName}
                          <div className="mt-1 text-xs font-semibold text-green-950/50">
                            {item.variant || ''}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-green-950">
                          {item.customerName}
                          <div className="mt-1 text-xs font-semibold text-green-950/50">
                            {item.customerEmail}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-green-950/70">{item.customerCountry || '-'}</td>
                        <td className="p-4 font-black text-green-950">{item.quantityKg}kg</td>
                        <td className="p-4 font-black text-green-950">{formatMoney(item.offeredPriceUSD)}</td>
                        <td className="p-4 font-black text-green-950">{formatMoney(item.listedPriceUSD)}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>
                            {statusLabel(item.status)}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-green-950/60">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedNegotiation?.chatHistory?.length > 0 && (
              <div className="border-t border-green-950/10 p-5">
                <h3 className="mb-4 text-xl font-black text-green-950">Request History</h3>
                <div className="space-y-3">
                  {selectedNegotiation.chatHistory.map((chat, index) => (
                    <div
                      key={`${chat.timestamp}-${index}`}
                      className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-950/75"
                    >
                      <div className="mb-1 font-black capitalize text-green-950">
                        {chat.sender === 'admin' ? 'Store Owner' : 'Customer'}
                      </div>
                      <div>{chat.message}</div>
                      <div className="mt-2 text-xs text-green-950/45">
                        {formatDate(chat.timestamp || chat.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

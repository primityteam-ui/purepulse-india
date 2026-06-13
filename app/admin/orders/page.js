'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const orderStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled']
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [form, setForm] = useState({
    paymentStatus: 'pending',
    orderStatus: 'processing',
    trackingNumber: '',
    shippingCarrier: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)

    try {
      const response = await fetch('/api/orders', { cache: 'no-store' })
      const data = await response.json()
      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return orders

    return orders.filter((order) =>
      `${order.orderNumber} ${order.customerName} ${order.customerEmail} ${order.customerCountry} ${order.orderStatus} ${order.paymentStatus}`
        .toLowerCase()
        .includes(value)
    )
  }, [orders, search])

  const totals = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.totalUSD || 0), 0)
    const pending = orders.filter((order) => order.orderStatus === 'processing').length
    const shipped = orders.filter((order) => order.orderStatus === 'shipped').length
    const delivered = orders.filter((order) => order.orderStatus === 'delivered').length

    return { revenue, pending, shipped, delivered }
  }, [orders])

  function openOrder(order) {
    setSelectedOrder(order)
    setForm({
      paymentStatus: order.paymentStatus || 'pending',
      orderStatus: order.orderStatus || 'processing',
      trackingNumber: order.trackingNumber || '',
      shippingCarrier: order.shippingCarrier || '',
      notes: order.notes || ''
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

  async function saveOrder(event) {
    event.preventDefault()

    if (!selectedOrder?._id) {
      setMessage('Select an order first.')
      return
    }

    setSaving(true)
    setMessage('Saving order update...')

    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not update order')
      }

      setSelectedOrder(data.order)
      setMessage('Order updated successfully.')
      await loadOrders()
    } catch (error) {
      setMessage(error.message || 'Order update failed')
    } finally {
      setSaving(false)
    }
  }

  function formatDate(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString()
  }

  function statusClass(status) {
    if (status === 'paid' || status === 'delivered') return 'bg-green-100 text-green-800'
    if (status === 'shipped' || status === 'confirmed') return 'bg-blue-100 text-blue-800'
    if (status === 'cancelled' || status === 'failed') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">Admin Orders</div>
            <h1 className="text-5xl font-black text-green-950">Manage Customer Orders</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Update payment status, shipping status, carrier, tracking number, and admin notes.
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
            <div className="text-sm font-black text-green-950/50">Total Orders</div>
            <div className="mt-2 text-4xl font-black text-green-950">{orders.length}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Revenue USD</div>
            <div className="mt-2 text-4xl font-black text-green-950">${totals.revenue.toFixed(2)}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Processing</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.pending}</div>
          </div>

          <div className="card-premium p-5">
            <div className="text-sm font-black text-green-950/50">Shipped</div>
            <div className="mt-2 text-4xl font-black text-green-950">{totals.shipped}</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_1.15fr]">
          <form onSubmit={saveOrder} className="card-premium h-fit p-6 md:p-8">
            <h2 className="mb-6 text-3xl font-black text-green-950">
              {selectedOrder ? `Edit ${selectedOrder.orderNumber}` : 'Select an Order'}
            </h2>

            {!selectedOrder ? (
              <div className="rounded-3xl bg-green-50 p-6 text-green-950/65">
                Click an order from the table to view and update it.
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-950">Customer</h3>
                  <div className="mt-3 space-y-1 text-sm font-semibold text-green-950/65">
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerPhone || '-'}</p>
                    <p><strong>Country:</strong> {selectedOrder.customerCountry || selectedOrder.customerAddress?.country || '-'}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-950">Shipping Address</h3>
                  <div className="mt-3 text-sm font-semibold leading-7 text-green-950/65">
                    <p>{selectedOrder.customerAddress?.line1}</p>
                    {selectedOrder.customerAddress?.line2 ? <p>{selectedOrder.customerAddress.line2}</p> : null}
                    <p>
                      {selectedOrder.customerAddress?.city}, {selectedOrder.customerAddress?.state} {selectedOrder.customerAddress?.postalCode}
                    </p>
                    <p>{selectedOrder.customerAddress?.country}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#fff7df] p-5">
                  <h3 className="mb-4 text-xl font-black text-green-950">Items</h3>

                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={`${item.productName}-${index}`} className="rounded-2xl bg-white p-4">
                        <div className="font-black text-green-950">{item.productName}</div>
                        <div className="mt-1 text-sm font-bold text-green-950/55">
                          {item.variant} × {item.quantity} — ${Number(item.priceUSD || 0).toFixed(2)} each
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right text-2xl font-black text-green-950">
                    Total: ${Number(selectedOrder.totalUSD || 0).toFixed(2)}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">Payment Status</span>
                    <select
                      className="input-premium"
                      value={form.paymentStatus}
                      onChange={(e) => updateField('paymentStatus', e.target.value)}
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">Order Status</span>
                    <select
                      className="input-premium"
                      value={form.orderStatus}
                      onChange={(e) => updateField('orderStatus', e.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="input-premium"
                    placeholder="Shipping carrier, example DHL / FedEx"
                    value={form.shippingCarrier}
                    onChange={(e) => updateField('shippingCarrier', e.target.value)}
                  />

                  <input
                    className="input-premium"
                    placeholder="Tracking number"
                    value={form.trackingNumber}
                    onChange={(e) => updateField('trackingNumber', e.target.value)}
                  />
                </div>

                <textarea
                  className="input-premium min-h-28"
                  placeholder="Admin notes"
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                />

                <button disabled={saving} className="btn-primary w-full">
                  {saving ? 'Saving...' : 'Save Order Update'}
                </button>
              </div>
            )}
          </form>

          <div>
            <div className="card-premium mb-5 p-5">
              <input
                className="input-premium"
                placeholder="Search orders by number, name, email, country, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="card-premium overflow-hidden">
              <div className="border-b border-green-900/10 p-5">
                <h2 className="text-2xl font-black text-green-950">
                  Orders {loading ? '' : `(${filteredOrders.length})`}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-left text-sm text-green-950/60">
                      <th className="p-4 font-black">Order</th>
                      <th className="p-4 font-black">Customer</th>
                      <th className="p-4 font-black">Country</th>
                      <th className="p-4 font-black">Total</th>
                      <th className="p-4 font-black">Payment</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 font-black">Date</th>
                      <th className="p-4 font-black">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-t border-green-900/10">
                        <td className="p-4">
                          <div className="font-black text-green-950">{order.orderNumber}</div>
                          <div className="text-xs font-bold text-green-950/45">
                            {(order.items || []).length} item groups
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-green-950">{order.customerName}</div>
                          <div className="text-xs font-bold text-green-950/45">{order.customerEmail}</div>
                        </td>

                        <td className="p-4 font-bold text-green-950/65">
                          {order.customerCountry || order.customerAddress?.country || '-'}
                        </td>

                        <td className="p-4 font-black text-green-950">
                          ${Number(order.totalUSD || 0).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="p-4 text-sm font-bold text-green-950/55">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => openOrder(order)}
                            className="rounded-full bg-green-950 px-4 py-2 text-sm font-black text-white"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="8" className="p-10 text-center font-black text-green-950/50">
                          No orders found.
                        </td>
                      </tr>
                    )}

                    {loading && (
                      <tr>
                        <td colSpan="8" className="p-10 text-center font-black text-green-950/50">
                          Loading orders...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-green-950 p-5 text-white">
              <h3 className="font-black">Store owner workflow</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Customer places order → owner sees it here → confirms payment → ships package → adds tracking number → customer tracks order on the public tracking page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

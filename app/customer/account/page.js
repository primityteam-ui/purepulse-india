'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function money(value, currency = 'USD') {
  const number = Number(value || 0)
  return `${currency} ${number.toFixed(2)}`
}

function niceStatus(value) {
  return String(value || 'pending').replaceAll('_', ' ')
}

export default function CustomerAccountPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/customer/login?callbackUrl=/customer/account')
    }
  }, [status, router])

  useEffect(() => {
    async function loadOrders() {
      if (status !== 'authenticated') return

      setLoadingOrders(true)

      try {
        const response = await fetch('/api/customer/orders', { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Could not load orders.')
        }

        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (error) {
        setMessage(error.message || 'Could not load orders.')
      } finally {
        setLoadingOrders(false)
      }
    }

    loadOrders()
  }, [status])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <section className="section-padding">
        <div className="container-premium">
          <div className="card-premium p-8 text-center font-bold text-green-950">
            Loading customer account...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">My Account</div>
            <h1 className="text-5xl font-black text-green-950">
              Welcome, {session?.user?.name || 'Customer'}
            </h1>
            <p className="mt-3 text-lg text-green-950/60">
              Logged in as {session?.user?.email}.
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/customer/login' })}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-3xl bg-red-50 p-5 font-bold text-red-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-premium p-6">
            <div className="text-sm font-black text-green-950/50">Total Orders</div>
            <div className="mt-2 text-4xl font-black text-green-950">{orders.length}</div>
          </div>

          <div className="card-premium p-6">
            <div className="text-sm font-black text-green-950/50">Pending Payment</div>
            <div className="mt-2 text-4xl font-black text-green-950">
              {orders.filter((order) => order.paymentStatus === 'pending').length}
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="text-sm font-black text-green-950/50">Confirmed</div>
            <div className="mt-2 text-4xl font-black text-green-950">
              {orders.filter((order) => order.orderStatus === 'confirmed').length}
            </div>
          </div>
        </div>

        <div className="card-premium mt-8 overflow-hidden">
          <div className="border-b border-green-950/10 p-6">
            <h2 className="text-3xl font-black text-green-950">My Orders</h2>
            <p className="mt-2 text-green-950/60">
              Orders are matched by your account email.
            </p>
          </div>

          {loadingOrders ? (
            <div className="p-8 text-center font-bold text-green-950/60">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl">📦</div>
              <h3 className="mt-4 text-2xl font-black text-green-950">No orders yet</h3>
              <p className="mt-2 text-green-950/60">
                Shop products or request a bulk quote to get started.
              </p>
              <Link href="/shop" className="btn-primary mt-6">
                Shop Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-green-50 text-sm font-black text-green-950/65">
                  <tr>
                    <th className="p-4">Order</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Tracking</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-green-950/10">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="p-4">
                        <div className="font-black text-green-950">{order.orderNumber}</div>
                        <div className="mt-1 text-xs font-semibold text-green-950/50">
                          {order.items?.length || 0} item(s)
                        </div>
                      </td>
                      <td className="p-4 font-black text-green-950">
                        {money(order.totalPaid || order.totalUSD, order.currencyPaid || 'USD')}
                      </td>
                      <td className="p-4 font-bold capitalize text-green-950/70">
                        {niceStatus(order.paymentStatus)}
                      </td>
                      <td className="p-4 font-bold capitalize text-green-950/70">
                        {niceStatus(order.orderStatus)}
                      </td>
                      <td className="p-4 font-bold text-green-950/70">
                        {order.trackingNumber || 'Not available yet'}
                      </td>
                      <td className="p-4 text-sm font-bold text-green-950/55">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl bg-green-950 p-7 text-white">
          <h2 className="text-2xl font-black">Need help with an order?</h2>
          <p className="mt-3 leading-7 text-white/70">
            Use your order number when contacting Farm Origin. For bulk or export orders, the team may contact you directly for shipping, payment, and packaging confirmation.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/track-order" className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-green-950">
              Track Order
            </Link>
            <Link href="/contact" className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-black text-white">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

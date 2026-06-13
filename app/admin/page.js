'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function AdminDashboardPage() {
  const { data: session } = useSession()

  const cards = [
    {
      title: 'Manage Products',
      description: 'Edit prices, upload images, change stock, badges, and featured products.',
      href: '/admin/products',
      icon: '🌾'
    },
    {
      title: 'Manage Orders',
      description: 'View customer orders, update status, add tracking number, and carrier.',
      href: '/admin/orders',
      icon: '📦'
    },
    {
      title: 'Negotiations',
      description: 'View bulk price offers and convert accepted offers into orders.',
      href: '/admin/negotiations',
      icon: '🤝'
    },
    {
      title: 'Store Settings',
      description: 'Update sale banner, WhatsApp number, business email, and payment settings.',
      href: '/admin/settings',
      icon: '⚙️'
    }
  ]

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">Admin Dashboard</div>
            <h1 className="text-5xl font-black text-green-950">Store Owner Control Panel</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Logged in as {session?.user?.email || 'admin'}.
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="card-premium block p-7 transition hover:-translate-y-1">
              <div className="text-5xl">{card.icon}</div>
              <h2 className="mt-5 text-3xl font-black text-green-950">{card.title}</h2>
              <p className="mt-3 leading-7 text-green-950/62">{card.description}</p>
              <div className="mt-6 inline-flex rounded-full bg-green-950 px-5 py-3 text-sm font-black text-white">
                Open
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-green-950 p-7 text-white">
          <h2 className="text-2xl font-black">For your customer business</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/65">
            The business owner should only use this admin panel. They should never touch code, MongoDB, terminal, GitHub, or Vercel.
          </p>
        </div>
      </div>
    </section>
  )
}

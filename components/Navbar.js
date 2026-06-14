'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import CurrencySwitcher from '@/components/CurrencySwitcher'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { getCartCount } = useCart()
  const count = getCartCount()

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/farming', label: 'Farming' },
    { href: '/bulk', label: 'Bulk Orders' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/10 bg-[#fffaf0]/88 backdrop-blur-xl">
      <div className="container-premium flex h-20 items-center justify-between gap-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-950 text-lg font-black text-[#f1cf75] shadow-lg shadow-green-950/20">
            PP
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-green-950">Farm Origin</div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-green-800/70">
              Organic exports
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font800 font-bold text-green-950/75 transition hover:text-green-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySwitcher />
          <Link href="/customer/account" className="rounded-full bg-white px-5 py-3 text-sm font-black text-green-950 shadow-sm">
            My Account
          </Link>
          <Link href="/cart" className="btn-secondary px-5">
            Cart {count > 0 ? `(${count})` : ''}
          </Link>
          <Link href="/shop" className="btn-primary px-5">
            Shop Now
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-2xl border border-green-900/10 bg-white px-4 py-3 font-black text-green-950 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-green-900/10 bg-[#fffaf0] lg:hidden">
          <div className="container-premium flex flex-col gap-3 py-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-white px-4 py-3 font-bold text-green-950"
              >
                {link.label}
              </Link>
            ))}
            <CurrencySwitcher />
            <Link href="/customer/account" onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 font-bold text-green-950">
              My Account
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="btn-secondary">
              Cart {count > 0 ? `(${count})` : ''}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
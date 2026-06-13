'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()

        if (data.settings) {
          setSettings(data.settings)
        }
      } catch {
        setSettings(null)
      }
    }

    loadSettings()
  }, [])

  const whatsappDisplay = settings?.whatsappNumber || '91XXXXXXXXXX'
  const email = settings?.businessEmail || 'sales@purepulseindia.com'

  const whatsappLink = useMemo(() => {
    const number = String(whatsappDisplay).replace(/\D/g, '')
    if (!number) return '#'
    return `https://wa.me/${number}`
  }, [whatsappDisplay])

  return (
    <footer className="mt-16 bg-green-950 text-white">
      <div className="container-premium py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8a441] font-black text-green-950">
                PP
              </div>
              <div>
                <div className="text-xl font-black">PurePulse India</div>
                <div className="text-sm text-white/60">Organic Indian pulses worldwide</div>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/68">
              Premium organic lentils, chickpeas, beans, and specialty pulses sourced from trusted Indian farms and prepared for global families, restaurants, and wholesale buyers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-[#f1cf75]">Shop</h3>
            <div className="space-y-3 text-sm text-white/68">
              <Link className="block hover:text-white" href="/shop">All Products</Link>
              <Link className="block hover:text-white" href="/bulk">Bulk Orders</Link>
              <Link className="block hover:text-white" href="/track-order">Track Order</Link>
              <Link className="block hover:text-white" href="/cart">Cart</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-black text-[#f1cf75]">Company</h3>
            <div className="space-y-3 text-sm text-white/68">
              <Link className="block hover:text-white" href="/about">About</Link>
              <Link className="block hover:text-white" href="/farming">Farming</Link>
              <Link className="block hover:text-white" href="/contact">Contact</Link>
              <Link className="block hover:text-white" href="/admin">Admin</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-black text-[#f1cf75]">Contact</h3>
            <div className="space-y-3 text-sm text-white/68">
              <a className="block hover:text-white" href={`mailto:${email}`}>{email}</a>
              <a className="block hover:text-white" href={whatsappLink} target="_blank" rel="noreferrer">
                WhatsApp: +{whatsappDisplay}
              </a>
              <p>Export-ready from India</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} PurePulse India. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

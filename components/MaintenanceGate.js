'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MaintenanceGate({ children }) {
  const pathname = usePathname()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' })
        const data = await response.json()
        setMaintenanceMode(Boolean(data.settings?.maintenanceMode))
      } catch {
        setMaintenanceMode(false)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const allowedDuringMaintenance =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/maintenance')

  if (loading) {
    return children
  }

  if (maintenanceMode && !allowedDuringMaintenance) {
    return (
      <section className="min-h-[calc(100vh-160px)] bg-green-950 py-24 text-white">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl bg-[#d8a441] text-4xl">
              🌾
            </div>

            <div className="badge-premium mb-6 bg-white/10 text-[#f1cf75]">
              Store temporarily paused
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
              PurePulse India is being updated.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              We are improving products, prices, shipping, or store settings. Please check back soon.
            </p>

            <a href="/admin/login" className="btn-primary mt-8">
              Store Owner Login
            </a>
          </div>
        </div>
      </section>
    )
  }

  return children
}

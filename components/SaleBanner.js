'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SaleBanner() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' })
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

  if (
    settings?.maintenanceMode ||
    !settings?.saleBannerEnabled ||
    !settings?.saleBannerText
  ) {
    return null
  }

  return (
    <div className="bg-[#d8a441] px-4 py-3 text-center text-sm font-black text-green-950">
      <Link href="/shop">
        {settings.saleBannerText}
      </Link>
    </div>
  )
}

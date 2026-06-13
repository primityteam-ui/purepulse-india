'use client'

import { useEffect, useMemo, useState } from 'react'

export default function WhatsAppButton() {
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

  const whatsappLink = useMemo(() => {
    const number = String(settings?.whatsappNumber || '').replace(/\D/g, '')

    if (!number) return null

    const message = encodeURIComponent(
      'Hello PurePulse India, I am interested in your organic pulses and lentils.'
    )

    return `https://wa.me/${number}?text=${message}`
  }, [settings])

  if (settings?.maintenanceMode || !whatsappLink) {
    return null
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-4 font-black text-white shadow-2xl shadow-green-950/25 transition hover:-translate-y-1"
      aria-label="Contact on WhatsApp"
    >
      <span className="text-2xl">💬</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}

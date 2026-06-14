'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const defaultSettings = {
  saleBannerEnabled: true,
  saleBannerText: '',
  bulkDiscountEnabled: true,
  bulkDiscountMinKg: 25,
  bulkDiscountPercent: 10,
  whatsappNumber: '',
  businessEmail: '',
  minimumNegotiationKg: 25,
  stripeEnabled: true,
  razorpayEnabled: true,
  maintenanceMode: false
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)

    try {
      const response = await fetch('/api/settings', { cache: 'no-store' })
      const data = await response.json()

      if (data.settings) {
        setSettings({
          ...defaultSettings,
          ...data.settings
        })
      }
    } catch {
      setMessage('Could not load settings.')
    } finally {
      setLoading(false)
    }
  }

  function updateField(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function saveSettings(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('Saving settings...')

    try {
      const payload = {
        ...settings,
        bulkDiscountMinKg: Number(settings.bulkDiscountMinKg),
        bulkDiscountPercent: Number(settings.bulkDiscountPercent),
        minimumNegotiationKg: Number(settings.minimumNegotiationKg)
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not save settings')
      }

      setSettings({
        ...defaultSettings,
        ...data.settings
      })

      setMessage('Settings saved successfully.')
    } catch (error) {
      setMessage(error.message || 'Settings save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="badge-premium mb-4">Admin Settings</div>
            <h1 className="text-5xl font-black text-green-950">Store Settings</h1>
            <p className="mt-3 text-lg text-green-950/60">
              Change sale banner, discount rules, contact info, and payment availability.
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

        {loading ? (
          <div className="card-premium p-10 text-center font-black text-green-950">
            Loading settings...
          </div>
        ) : (
          <form onSubmit={saveSettings} className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
            <div className="space-y-8">
              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Sale Banner</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  This is the top offer message shown on the website.
                </p>

                <div className="mt-6 grid gap-4">
                  <label className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-black text-green-950">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.saleBannerEnabled)}
                      onChange={(e) => updateField('saleBannerEnabled', e.target.checked)}
                    />
                    Show sale banner
                  </label>

                  <textarea
                    className="input-premium min-h-28"
                    placeholder="Sale banner text"
                    value={settings.saleBannerText}
                    onChange={(e) => updateField('saleBannerText', e.target.value)}
                  />
                </div>
              </div>

              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Bulk Discount</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  Control automatic discount rules for bigger orders.
                </p>

                <div className="mt-6 grid gap-4">
                  <label className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-black text-green-950">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.bulkDiscountEnabled)}
                      onChange={(e) => updateField('bulkDiscountEnabled', e.target.checked)}
                    />
                    Enable bulk discount
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-black text-green-950/60">
                        Minimum KG for discount
                      </span>
                      <input
                        className="input-premium"
                        type="number"
                        value={settings.bulkDiscountMinKg}
                        onChange={(e) => updateField('bulkDiscountMinKg', e.target.value)}
                      />
                    </label>

                    <label>
                      <span className="mb-2 block text-sm font-black text-green-950/60">
                        Discount percent
                      </span>
                      <input
                        className="input-premium"
                        type="number"
                        value={settings.bulkDiscountPercent}
                        onChange={(e) => updateField('bulkDiscountPercent', e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Business Contact</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  Used for footer, contact, and WhatsApp button.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">
                      WhatsApp Number
                    </span>
                    <input
                      className="input-premium"
                      placeholder="91XXXXXXXXXX"
                      value={settings.whatsappNumber}
                      onChange={(e) => updateField('whatsappNumber', e.target.value)}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">
                      Business Email
                    </span>
                    <input
                      className="input-premium"
                      type="email"
                      placeholder="sales@farmorigin.com"
                      value={settings.businessEmail}
                      onChange={(e) => updateField('businessEmail', e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Negotiation Rules</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  Minimum quantity allowed for price negotiation.
                </p>

                <div className="mt-6">
                  <label>
                    <span className="mb-2 block text-sm font-black text-green-950/60">
                      Minimum negotiation KG
                    </span>
                    <input
                      className="input-premium"
                      type="number"
                      value={settings.minimumNegotiationKg}
                      onChange={(e) => updateField('minimumNegotiationKg', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Payments</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  Turn payment options on or off.
                </p>

                <div className="mt-6 grid gap-4">
                  <label className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-black text-green-950">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.stripeEnabled)}
                      onChange={(e) => updateField('stripeEnabled', e.target.checked)}
                    />
                    Stripe enabled
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-black text-green-950">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.razorpayEnabled)}
                      onChange={(e) => updateField('razorpayEnabled', e.target.checked)}
                    />
                    Razorpay enabled
                  </label>
                </div>
              </div>

              <div className="card-premium p-6 md:p-8">
                <h2 className="text-3xl font-black text-green-950">Maintenance</h2>
                <p className="mt-2 text-sm font-semibold text-green-950/55">
                  Use this when owner wants to temporarily pause public ordering.
                </p>

                <label className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 font-black text-red-700">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.maintenanceMode)}
                    onChange={(e) => updateField('maintenanceMode', e.target.checked)}
                  />
                  Maintenance mode
                </label>
              </div>

              <div className="rounded-3xl bg-green-950 p-6 text-white">
                <h3 className="text-2xl font-black">Owner workflow</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  The business owner can update public offers, contact details, payment availability, and bulk rules from here. No code changes needed.
                </p>
              </div>

              <button disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving Settings...' : 'Save Settings'}
              </button>
            </aside>
          </form>
        )}
      </div>
    </section>
  )
}

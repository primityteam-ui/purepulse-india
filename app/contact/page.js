'use client'

import { useEffect, useMemo, useState } from 'react'

export default function ContactPage() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

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

  const email = settings?.businessEmail || 'sales@purepulseindia.com'
  const whatsappNumber = settings?.whatsappNumber || '91XXXXXXXXXX'

  const whatsappLink = useMemo(() => {
    const number = String(whatsappNumber).replace(/\D/g, '')
    if (!number) return '#'
    return `https://wa.me/${number}?text=${encodeURIComponent('Hello PurePulse India, I want to ask about your products.')}`
  }, [whatsappNumber])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitContact(event) {
    event.preventDefault()
    setStatus('Sending...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error('Failed')

      setStatus('Message received. We will reply soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('Could not send message. Please check backend/email setup.')
    }
  }

  return (
    <div>
      <section className="bg-green-950 py-24 text-white">
        <div className="container-premium">
          <div className="badge-premium mb-5 bg-white/10 text-[#f1cf75]">Contact</div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Talk to PurePulse India.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Ask about products, orders, shipping, wholesale, or export requirements.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="card-premium p-6">
              <h2 className="text-2xl font-black text-green-950">Email</h2>
              <a href={`mailto:${email}`} className="mt-2 block text-green-950/62 hover:text-green-950">
                {email}
              </a>
            </div>

            <div className="card-premium p-6">
              <h2 className="text-2xl font-black text-green-950">WhatsApp</h2>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-2 block text-green-950/62 hover:text-green-950">
                +{whatsappNumber}
              </a>
            </div>

            <div className="card-premium p-6">
              <h2 className="text-2xl font-black text-green-950">Business</h2>
              <p className="mt-2 text-green-950/62">
                Retail orders, wholesale orders, and global inquiries.
              </p>
            </div>
          </div>

          <form onSubmit={submitContact} className="card-premium p-6 md:p-8">
            <h2 className="mb-6 text-3xl font-black text-green-950">Send a message</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-premium" placeholder="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
              <input className="input-premium" type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
            </div>

            <input className="input-premium mt-4" placeholder="Subject" value={form.subject} onChange={(e) => updateField('subject', e.target.value)} required />
            <textarea className="input-premium mt-4 min-h-40" placeholder="Message" value={form.message} onChange={(e) => updateField('message', e.target.value)} required />

            <button className="btn-primary mt-5 w-full">Send Message</button>

            {status && <p className="mt-4 rounded-2xl bg-green-50 p-4 font-bold text-green-950">{status}</p>}
          </form>
        </div>
      </section>
    </div>
  )
}

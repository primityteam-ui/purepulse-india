'use client'

import { useState } from 'react'

export default function BulkPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    product: '',
    quantityKg: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitInquiry(event) {
    event.preventDefault()
    setStatus('Sending...')

    try {
      const response = await fetch('/api/bulk-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error('Failed')

      setStatus('Your bulk inquiry has been received. We will contact you soon.')
      setForm({ name: '', email: '', company: '', country: '', product: '', quantityKg: '', message: '' })
    } catch {
      setStatus('Could not send inquiry. Please check backend/email setup.')
    }
  }

  return (
    <div>
      <section className="bg-green-950 py-24 text-white">
        <div className="container-premium">
          <div className="badge-premium mb-5 bg-white/10 text-[#f1cf75]">Bulk and wholesale</div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Wholesale organic pulses for stores, restaurants, and distributors.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Request quotes for 25kg, 50kg, 100kg, or larger recurring orders.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            {[
              ['25kg+', 'Small bulk orders for restaurants and local stores.'],
              ['100kg+', 'Better pricing for wholesale and recurring buyers.'],
              ['Export-ready', 'Designed for international customers and Indian grocery buyers.']
            ].map((item) => (
              <div key={item[0]} className="card-premium p-6">
                <h2 className="text-3xl font-black text-green-950">{item[0]}</h2>
                <p className="mt-2 leading-7 text-green-950/62">{item[1]}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submitInquiry} className="card-premium p-6 md:p-8">
            <h2 className="mb-6 text-3xl font-black text-green-950">Request a bulk quote</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-premium" placeholder="Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
              <input className="input-premium" type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              <input className="input-premium" placeholder="Company" value={form.company} onChange={(e) => updateField('company', e.target.value)} />
              <input className="input-premium" placeholder="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} required />
              <input className="input-premium" placeholder="Product needed" value={form.product} onChange={(e) => updateField('product', e.target.value)} required />
              <input className="input-premium" type="number" placeholder="Quantity kg" value={form.quantityKg} onChange={(e) => updateField('quantityKg', e.target.value)} required />
            </div>

            <textarea className="input-premium mt-4 min-h-36" placeholder="Tell us your requirement" value={form.message} onChange={(e) => updateField('message', e.target.value)} />

            <button className="btn-primary mt-5 w-full">Send Bulk Inquiry</button>

            {status && <p className="mt-4 rounded-2xl bg-green-50 p-4 font-bold text-green-950">{status}</p>}
          </form>
        </div>
      </section>
    </div>
  )
}

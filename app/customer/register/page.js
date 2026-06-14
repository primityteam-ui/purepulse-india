'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CustomerRegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not create account.')
      }

      const loginResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl: '/customer/account'
      })

      if (loginResult?.error) {
        router.push('/customer/login')
        return
      }

      router.push('/customer/account')
      router.refresh()
    } catch (error) {
      setError(error.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mx-auto max-w-xl">
          <div className="card-premium p-8">
            <div className="mb-8 text-center">
              <div className="badge-premium mb-4">Customer Account</div>
              <h1 className="text-4xl font-black text-green-950">Create account</h1>
              <p className="mt-3 text-green-950/60">
                Save your details and view your Farm Origin orders anytime.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <input
                className="input-premium w-full"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />

              <input
                className="input-premium w-full"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="input-premium w-full"
                  placeholder="Phone / WhatsApp"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                />

                <input
                  className="input-premium w-full"
                  placeholder="Country"
                  value={form.country}
                  onChange={(event) => updateField('country', event.target.value)}
                />
              </div>

              <input
                className="input-premium w-full"
                type="password"
                placeholder="Password, minimum 6 characters"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                required
              />

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Creating account...' : 'Create Customer Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-green-950/60">
              Already have an account?{' '}
              <Link href="/customer/login" className="font-black text-green-800">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

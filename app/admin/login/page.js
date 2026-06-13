'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid admin email or password.')
      return
    }

    router.replace(callbackUrl)
  }

  return (
    <section className="min-h-[calc(100vh-160px)] bg-green-950 py-20 text-white">
      <div className="container-premium">
        <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white p-7 text-green-950 shadow-2xl">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-green-950 text-xl font-black text-[#f1cf75]">
              PP
            </div>
            <h1 className="text-3xl font-black">Store Owner Login</h1>
            <p className="mt-2 text-sm font-semibold text-green-950/55">
              Login to manage products, prices, images, orders, and settings.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <input
              className="input-premium"
              type="email"
              placeholder="Admin email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />

            <input
              className="input-premium"
              type="password"
              placeholder="Admin password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />

            <button disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-950/65">
            Demo admin from your `.env.local`:
            <br />
            <strong>admin@purepulseindia.com</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

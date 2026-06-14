'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid admin email or password.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8f5ec] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white border border-emerald-100 shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-700">
            Farm Origin
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Sign in to manage products, orders, settings, and bulk negotiations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              className="input-premium w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@farmorigin.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="input-premium w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-500">
          Protected owner dashboard for Farm Origin.
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f5ec] flex items-center justify-center">
          <p className="text-stone-600">Loading admin login...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}

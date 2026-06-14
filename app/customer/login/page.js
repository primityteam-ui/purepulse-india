'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function CustomerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/customer/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
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
      setError('Invalid email or password.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="mx-auto max-w-md">
          <div className="card-premium p-8">
            <div className="mb-8 text-center">
              <div className="badge-premium mb-4">Customer Account</div>
              <h1 className="text-4xl font-black text-green-950">Login</h1>
              <p className="mt-3 text-green-950/60">
                View your orders, payment status, and tracking details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                className="input-premium w-full"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <input
                className="input-premium w-full"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Logging in...' : 'Login to My Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-green-950/60">
              New customer?{' '}
              <Link href="/customer/register" className="font-black text-green-800">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<section className="section-padding"><div className="container-premium">Loading...</div></section>}>
      <CustomerLoginForm />
    </Suspense>
  )
}

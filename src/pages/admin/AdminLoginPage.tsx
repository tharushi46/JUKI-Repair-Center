import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLogin, subscribeAdminAuth } from '../../lib/adminAuth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('jukirepaircenter@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const redirectTo = useMemo(() => {
    const st = location.state as { from?: string } | null
    return st?.from && typeof st.from === 'string' ? st.from : '/admin/dashboard'
  }, [location.state])

  useEffect(() => {
    const unsub = subscribeAdminAuth((user) => {
      if (user) navigate('/admin/dashboard', { replace: true })
    })
    return () => unsub()
  }, [navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await adminLogin(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-2xl font-black tracking-tight text-slate-900">Admin Login</div>
          <div className="mt-1 text-sm text-slate-600">
            This page is intentionally hidden from the main navigation.
          </div>
        </div>

        <form className="card space-y-4 p-6" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="jukirepaircenter@gmail.com"
              autoComplete="username"
              inputMode="email"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <button disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}


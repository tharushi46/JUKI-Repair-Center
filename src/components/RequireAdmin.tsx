import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { subscribeAdminAuth } from '../lib/adminAuth'
import { Spinner } from './Spinner'

export function RequireAdmin({ children }: PropsWithChildren) {
  const location = useLocation()
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsub = subscribeAdminAuth((u) => setUser(u))
    return () => unsub()
  }, [])

  if (user === undefined) {
    return <Spinner label="Checking admin session…" />
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />
  }
  return children
}


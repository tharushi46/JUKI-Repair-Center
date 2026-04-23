import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from './firebase'

export const ADMIN_EMAIL = 'jukirepaircenter@gmail.com'

export function isAdminUser(user: User | null | undefined) {
  return Boolean(user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
}

export async function adminLogin(email: string, password: string) {
  const e = email.trim()
  const p = password.trim()
  const cred = await signInWithEmailAndPassword(auth, e, p)
  if (!isAdminUser(cred.user)) {
    await signOut(auth)
    throw new Error('This account is not allowed to access admin.')
  }
  return cred.user
}

export async function adminLogout() {
  await signOut(auth)
}

export function subscribeAdminAuth(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    onChange(isAdminUser(user) ? user : null)
  })
}


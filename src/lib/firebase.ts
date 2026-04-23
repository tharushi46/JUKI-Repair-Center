import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

function req(name: string) {
  const v = import.meta.env[name] as string | undefined
  if (!v) throw new Error(`Missing ${name}. Copy .env.example to .env and fill Firebase config.`)
  return v
}

const firebaseConfig = {
  apiKey: req('VITE_FIREBASE_API_KEY'),
  authDomain: req('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: req('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: req('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: req('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: req('VITE_FIREBASE_APP_ID'),
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firestore = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
export const auth = getAuth(firebaseApp)


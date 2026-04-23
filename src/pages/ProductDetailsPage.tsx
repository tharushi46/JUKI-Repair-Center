import { motion } from 'framer-motion'
import { ArrowLeft, PhoneCall, MessageCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { BUSINESS, telHref, whatsappHref } from '../config/business'
import { subscribeProduct } from '../lib/products'
import type { Product } from '../types/Product'

export function ProductDetailsPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const unsub = subscribeProduct(
      id,
      (p) => {
        setProduct(p)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Failed to load product from Firestore:', err)
        setProduct(null)
        setError(err instanceof Error ? err.message : 'Failed to load product.')
        setLoading(false)
      },
    )
    return () => unsub()
  }, [id])

  const whatsappLink = useMemo(() => {
    const msg = product
      ? `Hello ${BUSINESS.name}, I’m interested in: ${product.name} (LKR ${product.price}).`
      : `Hello ${BUSINESS.name}, I’d like to inquire about sewing machines.`
    return whatsappHref(BUSINESS.whatsappE164, msg)
  }, [product])

  if (loading) return <Spinner label="Loading product…" />

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        </div>
        <div className="card p-8 text-center">
          <div className="text-sm font-semibold text-slate-700">Couldn’t load product.</div>
          <div className="mt-1 text-sm text-slate-500">{error}</div>
        </div>
      </motion.div>
    )
  }

  if (!product) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        </div>
        <div className="card p-8 text-center">
          <div className="text-sm font-semibold text-slate-700">Product not found.</div>
          <div className="mt-1 text-sm text-slate-500">It may have been removed.</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-3">
          <div className="aspect-[4/3] w-full bg-slate-100">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xl font-black tracking-tight text-slate-900">
                  {product.name}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  LKR {product.price.toLocaleString()}
                </div>
              </div>
              <span
                className={[
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                  product.available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                ].join(' ')}
              >
                {product.available ? 'Available' : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {product.description || 'No description provided.'}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a href={telHref(BUSINESS.phoneE164)} className="btn-primary w-full">
                <PhoneCall className="size-4" />
                Call Now
              </a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-secondary w-full">
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              For quick service, call {BUSINESS.phoneDisplay}.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


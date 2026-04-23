import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Headphones, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { SearchBar } from '../components/SearchBar'
import { Spinner } from '../components/Spinner'
import { BUSINESS, telHref, whatsappHref } from '../config/business'
import { subscribeProducts } from '../lib/products'
import type { Product } from '../types/Product'
import logoUrl from '../assets/logo.png'

export function HomePage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeProducts(
      (items) => {
        setProducts(items)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Failed to load products from Firestore:', err)
        setProducts([])
        setError(err instanceof Error ? err.message : 'Failed to load products.')
        setLoading(false)
      },
    )
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-28 size-72 rounded-full bg-slate-900/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 size-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(15,23,42,0.06),transparent_55%),radial-gradient(circle_at_85%_30%,rgba(14,165,233,0.12),transparent_45%)]" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
              <BadgeCheck className="size-4" />
              Repair • Sales • Genuine support
            </div>

            <div className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Professional sewing machine service for Juki models.
            </div>
            <div className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Fast diagnostics, quality repairs, and reliable after‑service support. Browse available machines
              or contact us to get a quote today.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={telHref(BUSINESS.phoneE164)} className="btn-primary">
                Call {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappHref(BUSINESS.whatsappE164, 'Hi, I need help with my Juki sewing machine.')}
                className="btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <div className="text-xs text-slate-500">
                Open daily • Quick response
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Wrench, label: 'Repair & tuning' },
                { icon: ShieldCheck, label: 'Quality parts' },
                { icon: Truck, label: 'Pickup options' },
                { icon: Headphones, label: 'After‑service' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 p-3">
                  <Icon className="size-5 text-slate-900" />
                  <div className="mt-2 text-xs font-semibold text-slate-700">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
              <div className="relative p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-14 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img
                      src={logoUrl}
                      alt={`${BUSINESS.name} logo`}
                      className="h-full w-full object-contain p-2"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-tight text-slate-900">
                      {BUSINESS.name}
                    </div>
                    <div className="text-xs text-slate-500">Sewing machine repair & sales</div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-700">Find a machine</div>
                  <div className="mt-2">
                    <SearchBar value={query} onChange={setQuery} />
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Search by model name (e.g. “DDL‑8100”)
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-lg font-black text-slate-900">
                      {loading ? '—' : products.length}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">Listed</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-lg font-black text-slate-900">Fast</div>
                    <div className="text-[11px] font-semibold text-slate-600">Service</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="text-lg font-black text-slate-900">Trusted</div>
                    <div className="text-[11px] font-semibold text-slate-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 px-1 sm:px-0">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900">
              Available Machines
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Browse listings and tap a machine to view details.
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Showing {loading ? '…' : filtered.length} result{loading || filtered.length === 1 ? '' : 's'}
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading products…" />
        ) : error ? (
          <div className="card p-8 text-center">
            <div className="text-sm font-semibold text-slate-700">Couldn’t load products.</div>
            <div className="mt-1 text-sm text-slate-500">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-sm font-semibold text-slate-700">
              No products match your search.
            </div>
            <div className="mt-1 text-sm text-slate-500">Try a different name.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="card overflow-hidden lg:col-span-5">
            <div className="border-b border-slate-200 bg-white p-5">
              <div className="text-lg font-black tracking-tight text-slate-900">Contact</div>
              <div className="mt-1 text-sm text-slate-600">Get in touch for repairs, sales, and support.</div>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div>
                <div className="text-xs font-semibold text-slate-500">Owner</div>
                <div className="font-semibold text-slate-900">{BUSINESS.owner}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Address</div>
                <div className="font-semibold text-slate-900">{BUSINESS.address}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Phone</div>
                <a className="font-semibold text-slate-900" href={telHref(BUSINESS.phoneE164)}>
                  0779491631
                </a>
              </div>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <a href={telHref(BUSINESS.phoneE164)} className="btn-primary">
                  Call now
                </a>
                <a
                  href={whatsappHref(
                    BUSINESS.whatsappE164,
                    'Hi, I need help with my Juki sewing machine. Please share details.',
                  )}
                  className="btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden lg:col-span-7">
            <div className="border-b border-slate-200 bg-white p-5">
              <div className="text-lg font-black tracking-tight text-slate-900">Location</div>
              <div className="mt-1 text-sm text-slate-600">Find us on the map.</div>
            </div>
            <div className="aspect-[16/9] w-full bg-slate-100">
              <iframe
                title="JUKI REPAIR map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${BUSINESS.address} ${BUSINESS.owner}`,
                )}&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}


import { motion } from 'framer-motion'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { adminLogout } from '../../lib/adminAuth'
import {
  createProduct,
  createProductWithImageUrl,
  deleteProduct,
  subscribeProducts,
  updateProduct,
} from '../../lib/products'
import type { Product } from '../../types/Product'
import { AdminProductForm, type AdminProductFormValues } from './AdminProductForm'

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="card w-full max-w-2xl p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="text-lg font-black tracking-tight text-slate-900">{title}</div>
          <button className="btn-secondary px-3 py-1.5" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [busy, setBusy] = useState(false)

  const [mode, setMode] = useState<'none' | 'create' | 'edit'>('none')
  const [editing, setEditing] = useState<Product | null>(null)

  useEffect(() => {
    const unsub = subscribeProducts((items) => {
      setProducts(items)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const sorted = useMemo(() => products, [products])

  async function onCreate(values: AdminProductFormValues) {
    setBusy(true)
    try {
      const url = (values.imageUrl ?? '').trim()
      if (url) {
        await createProductWithImageUrl({
          name: values.name,
          description: values.description,
          price: values.price,
          available: values.available,
          imageUrl: url,
        })
      } else if (values.imageFile instanceof File) {
        await createProduct({
          name: values.name,
          description: values.description,
          price: values.price,
          available: values.available,
          imageFile: values.imageFile,
        })
      } else {
        throw new Error('Please upload an image or enter an image URL.')
      }
      setMode('none')
      setEditing(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product.'
      alert(message)
    } finally {
      setBusy(false)
    }
  }

  async function onEdit(values: AdminProductFormValues) {
    if (!editing) return
    setBusy(true)
    try {
      await updateProduct(editing.id, {
        name: values.name,
        description: values.description,
        price: values.price,
        available: values.available,
        imageFile: values.imageFile instanceof File ? values.imageFile : undefined,
        previousImagePath: editing.imagePath,
      })
      setMode('none')
      setEditing(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product.'
      alert(message)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(p: Product) {
    const ok = confirm(`Delete "${p.name}"?`)
    if (!ok) return
    setBusy(true)
    try {
      await deleteProduct(p.id, p.imagePath)
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    adminLogout()
      .catch(() => {})
      .finally(() => navigate('/admin', { replace: true }))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">Dashboard</div>
          <div className="mt-1 text-sm text-slate-600">Manage products (add / edit / delete).</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-primary disabled:opacity-60"
            disabled={busy}
            onClick={() => {
              setEditing(null)
              setMode('create')
            }}
          >
            <Plus className="size-4" />
            Add Product
          </button>
          <button className="btn-secondary" onClick={logout}>
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading…" />
      ) : sorted.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-sm font-semibold text-slate-700">No products yet.</div>
          <div className="mt-1 text-sm text-slate-500">Add your first product to get started.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sorted.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="flex gap-4 p-4">
                <div className="size-24 overflow-hidden rounded-xl bg-slate-100">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-slate-500">No image</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-slate-900">{p.name}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    LKR {p.price.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-600">
                    {p.available ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-50 px-2 py-1 text-rose-700">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="btn-secondary px-3 py-2"
                    disabled={busy}
                    onClick={() => {
                      setEditing(p)
                      setMode('edit')
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button
                    className="btn-danger px-3 py-2 disabled:opacity-60"
                    disabled={busy}
                    onClick={() => onDelete(p)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
                {p.description ? p.description.slice(0, 140) + (p.description.length > 140 ? '…' : '') : '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'create' ? (
        <Modal title="Add product" onClose={() => setMode('none')}>
          <AdminProductForm
            requireImage
            submitLabel="Create"
            busy={busy}
            onCancel={() => setMode('none')}
            onSubmit={onCreate}
          />
        </Modal>
      ) : null}

      {mode === 'edit' && editing ? (
        <Modal title="Edit product" onClose={() => setMode('none')}>
          <AdminProductForm
            submitLabel="Save changes"
            busy={busy}
            initial={{
              name: editing.name,
              description: editing.description,
              price: editing.price,
              available: editing.available,
              imageUrl: editing.imageUrl,
            }}
            onCancel={() => setMode('none')}
            onSubmit={onEdit}
          />
        </Modal>
      ) : null}
    </motion.div>
  )
}


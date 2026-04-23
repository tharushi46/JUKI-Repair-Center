import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../types/Product'

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
      ].join(' ')}
    >
      {available ? 'Available' : 'Out of Stock'}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
              No image
            </div>
          )}
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-900">
                {product.name}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-slate-700">
                LKR {product.price.toLocaleString()}
              </div>
            </div>
            <AvailabilityBadge available={product.available} />
          </div>

          <div className="text-xs text-slate-500">Tap to view details</div>
        </div>
      </Link>
    </motion.div>
  )
}


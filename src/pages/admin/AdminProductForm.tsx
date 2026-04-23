import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().min(0, 'Price must be >= 0'),
  available: z.boolean(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a valid http(s) image URL'),
})

export type AdminProductFormValues = z.infer<typeof schema> & {
  imageFile?: File
}

export function AdminProductForm({
  initial,
  requireImage,
  submitLabel,
  onSubmit,
  onCancel,
  busy,
}: {
  initial?: Partial<AdminProductFormValues>
  requireImage?: boolean
  submitLabel: string
  busy?: boolean
  onSubmit: (values: AdminProductFormValues) => Promise<void> | void
  onCancel?: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      price: initial?.price ?? 0,
      available: initial?.available ?? true,
      imageUrl: initial?.imageUrl ?? '',
    },
  })

  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(() =>
    initial?.imageUrl ? 'url' : 'upload',
  )
  const imageUrl = watch('imageUrl')?.trim() ?? ''
  const imageError = useMemo(() => {
    if (!requireImage) return null
    if (imageMode === 'upload' && imageFile instanceof File) return null
    if (imageMode === 'url' && imageUrl) return null
    return 'Image is required'
  }, [imageFile, imageMode, imageUrl, requireImage])

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        if (imageError) return
        await onSubmit({
          ...values,
          imageFile: imageMode === 'upload' ? imageFile : undefined,
          imageUrl: imageMode === 'url' ? values.imageUrl?.trim() : '',
        } as unknown as AdminProductFormValues)
      })}
    >
      <div>
        <label className="text-sm font-semibold text-slate-800">Product name</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        {errors.name ? (
          <div className="mt-1 text-xs font-semibold text-rose-700">
            {errors.name.message}
          </div>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800">Description</label>
        <textarea
          {...register('description')}
          rows={5}
          className="mt-1 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        {errors.description ? (
          <div className="mt-1 text-xs font-semibold text-rose-700">
            {errors.description.message}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Price (LKR)</label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            min={0}
            step="1"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          {errors.price ? (
            <div className="mt-1 text-xs font-semibold text-rose-700">
              {errors.price.message}
            </div>
          ) : null}
        </div>

        <label className="flex items-center gap-2 self-end rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <input type="checkbox" {...register('available')} />
          <span className="text-sm font-semibold text-slate-800">Available</span>
        </label>
      </div>

      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <label className="text-sm font-semibold text-slate-800">Product image</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={[
                'rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                imageMode === 'upload'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')}
              onClick={() => setImageMode('upload')}
            >
              Upload
            </button>
            <button
              type="button"
              className={[
                'rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                imageMode === 'url'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')}
              onClick={() => setImageMode('url')}
            >
              Image URL
            </button>
          </div>
        </div>

        {imageMode === 'upload' ? (
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm"
              onChange={(e) => setImageFile(e.target.files?.[0])}
            />
            {imageFile ? (
              <div className="mt-1 text-xs text-slate-600">Selected: {imageFile.name}</div>
            ) : null}
          </div>
        ) : (
          <div className="mt-2">
            <input
              {...register('imageUrl')}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
            {errors.imageUrl ? (
              <div className="mt-1 text-xs font-semibold text-rose-700">
                {errors.imageUrl.message}
              </div>
            ) : null}
          </div>
        )}

        {imageError ? (
          <div className="mt-1 text-xs font-semibold text-rose-700">{imageError}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="btn-primary disabled:opacity-60" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}


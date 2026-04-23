import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import imageCompression from 'browser-image-compression'
import { firestore, storage } from './firebase'
import type { Product, ProductInput } from '../types/Product'

type ProductDoc = Omit<Product, 'id'> & {
  createdAt?: unknown
  updatedAt?: unknown
}

const productsCol = collection(firestore, 'products')

export function subscribeProducts(
  onChange: (products: Product[]) => void,
  onError?: (error: unknown) => void,
) {
  const q = query(productsCol, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const products: Product[] = snap.docs.map((d) => {
        const data = d.data() as ProductDoc
        return {
          id: d.id,
          name: data.name ?? '',
          description: data.description ?? '',
          price: Number(data.price ?? 0),
          available: Boolean(data.available),
          imageUrl: data.imageUrl ?? '',
          imagePath: data.imagePath,
        }
      })
      onChange(products)
    },
    (err) => {
      onError?.(err)
    },
  )
}

export function subscribeProduct(
  productId: string,
  onChange: (product: Product | null) => void,
  onError?: (error: unknown) => void,
) {
  return onSnapshot(
    doc(productsCol, productId),
    (snap) => {
      if (!snap.exists()) {
        onChange(null)
        return
      }
      const data = snap.data() as ProductDoc
      onChange({
        id: snap.id,
        name: data.name ?? '',
        description: data.description ?? '',
        price: Number(data.price ?? 0),
        available: Boolean(data.available),
        imageUrl: data.imageUrl ?? '',
        imagePath: data.imagePath,
      })
    },
    (err) => {
      onError?.(err)
    },
  )
}

export async function createProduct(input: Omit<ProductInput, 'imageUrl'> & { imageFile: File }) {
  const { imageFile, ...rest } = input
  const uploaded = await uploadProductImage(imageFile)
  await addDoc(productsCol, {
    ...rest,
    imageUrl: uploaded.url,
    imagePath: uploaded.path,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function createProductWithImageUrl(input: Omit<ProductInput, 'imagePath'> & { imageUrl: string }) {
  const { imageUrl, ...rest } = input
  await addDoc(productsCol, {
    ...rest,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(
  productId: string,
  input: Partial<Omit<ProductInput, 'imageUrl'>> & { imageFile?: File; previousImagePath?: string; imageUrl?: string },
) {
  const productRef = doc(productsCol, productId)
  const patch: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  }

  if (typeof input.name === 'string') patch.name = input.name
  if (typeof input.description === 'string') patch.description = input.description
  if (typeof input.price === 'number') patch.price = input.price
  if (typeof input.available === 'boolean') patch.available = input.available

  if (input.imageFile) {
    const uploaded = await uploadProductImage(input.imageFile)
    patch.imageUrl = uploaded.url
    patch.imagePath = uploaded.path
    if (input.previousImagePath) {
      await safeDeleteStoragePath(input.previousImagePath)
    }
  } else if (typeof input.imageUrl === 'string') {
    patch.imageUrl = input.imageUrl
  }

  await updateDoc(productRef, patch)
}

export async function deleteProduct(productId: string, imagePath?: string) {
  await deleteDoc(doc(productsCol, productId))
  if (imagePath) await safeDeleteStoragePath(imagePath)
}

async function uploadProductImage(file: File) {
  const optimized = await imageCompression(file, {
    maxWidthOrHeight: 1400,
    maxSizeMB: 0.8,
    useWebWorker: true,
  })

  const safeName = file.name.replace(/[^\w.\-]+/g, '_')
  const path = `products/${Date.now()}_${safeName}`
  const objectRef = ref(storage, path)
  const data = await optimized.arrayBuffer()
  await uploadBytes(objectRef, new Uint8Array(data), {
    contentType: optimized.type || file.type,
    cacheControl: 'public,max-age=31536000',
  })
  const url = await getDownloadURL(objectRef)
  return { url, path }
}

async function safeDeleteStoragePath(path: string) {
  try {
    await deleteObject(ref(storage, path))
  } catch {
    // ignore missing permissions / missing object
  }
}


export type Product = {
  id: string
  name: string
  description: string
  price: number
  available: boolean
  imageUrl: string
  imagePath?: string
  createdAt?: number
  updatedAt?: number
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>


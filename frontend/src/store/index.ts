import { create } from 'zustand'

interface NewsState {
  news: Array<{
    id: string
    title: string
    content: string
    category: string
    date: string
    readTime: string
    author: string
    coverImage: string
  }>
  setNews: (news: NewsState['news']) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

interface ProductState {
  products: Array<{
    id: string
    name: string
    type: string
    version: string
    lastUpdate: string
    image: string
    description: string
  }>
  setProducts: (products: ProductState['products']) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

interface Store extends NewsState, ProductState {}

export const useStore = create<Store>((set) => ({
  // News state
  news: [],
  setNews: (news) => set({ news }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),

  // Products state
  products: [],
  setProducts: (products) => set({ products }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query })
})) 
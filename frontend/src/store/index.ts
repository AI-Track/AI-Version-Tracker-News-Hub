import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

interface LanguageState {
  language: 'zh' | 'en'
  setLanguage: (language: 'zh' | 'en') => void
}

interface ErrorState {
  globalError: {
    message: string;
    type: 'error' | 'warning' | 'info' | null;
  } | null;
  setGlobalError: (error: ErrorState['globalError']) => void;
  clearGlobalError: () => void;
}

interface Store extends NewsState, ProductState, ThemeState, LanguageState, ErrorState {}

export const useStore = create<Store>()(
  persist(
    (set) => ({
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
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Language state
      language: 'zh',
      setLanguage: (language) => set({ language }),

      // Global error state
      globalError: null,
      setGlobalError: (error) => set({ globalError: error }),
      clearGlobalError: () => set({ globalError: null }),
    }),
    {
      name: 'ai-news-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
) 
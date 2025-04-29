import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Product, ProductDetail, ProductVersion, productService } from '@/services/product-service';
import { useStore } from '@/store';

// 使用产品列表的 Hook
export function useProducts() {
  const { selectedCategory, searchQuery } = useStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // 获取所有产品
  const { 
    data: products, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useApi<Product[]>('/products', 'GET', {
    showToast: false,
  });
  
  // 过滤产品
  useEffect(() => {
    if (!products) return;
    
    const filtered = products.filter(product => {
      const matchesCategory = !selectedCategory || product.type === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);
  
  return {
    products: filteredProducts,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// 使用产品详情的 Hook
export function useProductDetail(id: string) {
  return useApi<ProductDetail>(`/products/${id}`, 'GET', {
    enabled: !!id,
  });
}

// 使用产品版本的 Hook
export function useProductVersions(id: string) {
  return useApi<ProductVersion[]>(`/products/${id}/versions`, 'GET', {
    enabled: !!id,
  });
} 
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Product, ProductDetail, ProductVersion } from '@/types/product';
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
    // Mock data for development
    onSuccess: (data) => {
      if (!data || data.length === 0) {
        return [{
          version: '1.0.0',
          date: '2024-03-20',
          type: 'major',
          importance: 'high',
          changes: [
            '初始版本发布',
            '基础功能实现',
          ],
          details: '这是我们的第一个正式版本，包含了所有基础功能。',
          features: [
            {
              title: '产品列表',
              description: '支持查看所有产品信息',
            },
            {
              title: '版本管理',
              description: '支持查看产品版本历史',
            }
          ]
        }];
      }
      return data;
    }
  });
} 
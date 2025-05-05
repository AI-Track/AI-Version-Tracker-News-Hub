import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Product, ProductDetail, ProductVersion } from '@/types/product';
import { useStore } from '@/store';
import { mockProducts } from '@/lib/mock-data';

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
export const useProductVersions = (productId: string | undefined) => {
  const [data, setData] = useState<ProductVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const product = mockProducts[productId];
        if (!product) {
          throw new Error('Product not found');
        }

        // 确保版本数据存在
        if (!product.versions || !Array.isArray(product.versions)) {
          throw new Error('No version data available');
        }
        
        setData(product.versions);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return { data, isLoading, error };
};

// 获取单个产品信息的 hook
export const useProduct = (productId: string | undefined) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const product = mockProducts[productId];
        if (!product) {
          throw new Error('Product not found');
        }
        
        setData(product);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return { data, isLoading, error };
}; 
import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, ApiError, apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

// 请求状态类型
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// 请求结果类型
export interface RequestResult<T> {
  data: T | null;
  error: ApiError | null;
  status: RequestStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

// 请求配置类型
export interface RequestOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  showToast?: boolean;
}

// 使用 API 请求的 Hook
export function useApi<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  config: RequestOptions = {}
): RequestResult<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    showToast = true,
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');

  // 执行请求的函数
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setStatus('loading');
    setError(null);

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(endpoint);
          break;
        case 'POST':
          response = await apiClient.post<T>(endpoint);
          break;
        case 'PUT':
          response = await apiClient.put<T>(endpoint);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(endpoint);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);
      setStatus('success');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (showToast && response.message) {
        toast({
          title: "Success",
          description: response.message,
        });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setStatus('error');
      
      if (onError) {
        onError(apiError);
      }
    }
  }, [endpoint, method, enabled, onSuccess, onError, showToast]);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    refetch: fetchData,
  };
}

// 使用 API 请求的 Hook（带参数）
export function useApiWithParams<T = any, P extends Record<string, string | number | boolean> = Record<string, string | number | boolean>>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  params?: P,
  config: RequestOptions = {}
): RequestResult<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    showToast = true,
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');

  // 执行请求的函数
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setStatus('loading');
    setError(null);

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(endpoint, { params });
          break;
        case 'POST':
          response = await apiClient.post<T>(endpoint, { data: params });
          break;
        case 'PUT':
          response = await apiClient.put<T>(endpoint, { data: params });
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(endpoint, { data: params });
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint, { params });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);
      setStatus('success');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (showToast && response.message) {
        toast({
          title: "Success",
          description: response.message,
        });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setStatus('error');
      
      if (onError) {
        onError(apiError);
      }
    }
  }, [endpoint, method, params, enabled, onSuccess, onError, showToast]);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    refetch: fetchData,
  };
} 
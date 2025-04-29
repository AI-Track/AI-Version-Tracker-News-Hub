import { toast } from "@/hooks/use-toast";

// API 响应类型
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// API 错误类型
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// 请求配置类型
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  data?: any;
}

// 基础 API 客户端类
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // 设置认证令牌
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    };
  }

  // 清除认证令牌
  clearAuthToken() {
    const { Authorization, ...headers } = this.defaultHeaders;
    this.defaultHeaders = headers;
  }

  // 处理 URL 参数
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  // 处理错误
  private handleError(error: any): ApiError {
    if (error instanceof Response) {
      return {
        message: `HTTP error! status: ${error.status}`,
        status: error.status,
      };
    }
    
    return {
      message: error.message || 'An unexpected error occurred',
      status: 500,
    };
  }

  // 显示错误提示
  private showErrorToast(error: ApiError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, data, headers = {}, ...restConfig } = config;
    
    try {
      const url = this.buildUrl(endpoint, params);
      
      const response = await fetch(url, {
        ...restConfig,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        ...(data && { body: JSON.stringify(data) }),
      });

      // 处理非 2xx 响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          errors: errorData.errors,
        };
        
        this.showErrorToast(error);
        throw error;
      }

      const responseData = await response.json();
      
      return {
        data: responseData.data || responseData,
        message: responseData.message,
        status: response.status,
      };
    } catch (error) {
      const apiError = this.handleError(error);
      this.showErrorToast(apiError);
      throw apiError;
    }
  }

  // GET 请求
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST' });
  }

  // PUT 请求
  async put<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT' });
  }

  // PATCH 请求
  async patch<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH' });
  }

  // DELETE 请求
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient();

// 创建 API 服务类
export class ApiService {
  protected client: ApiClient;
  protected baseEndpoint: string;

  constructor(baseEndpoint: string, client: ApiClient = apiClient) {
    this.client = client;
    this.baseEndpoint = baseEndpoint;
  }

  // 获取资源列表
  async getAll<T>(params?: Record<string, string | number | boolean>): Promise<ApiResponse<T[]>> {
    return this.client.get<T[]>(this.baseEndpoint, { params });
  }

  // 获取单个资源
  async getById<T>(id: string | number): Promise<ApiResponse<T>> {
    return this.client.get<T>(`${this.baseEndpoint}/${id}`);
  }

  // 创建资源
  async create<T>(data: any): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.baseEndpoint, { data });
  }

  // 更新资源
  async update<T>(id: string | number, data: any): Promise<ApiResponse<T>> {
    return this.client.put<T>(`${this.baseEndpoint}/${id}`, { data });
  }

  // 部分更新资源
  async patch<T>(id: string | number, data: any): Promise<ApiResponse<T>> {
    return this.client.patch<T>(`${this.baseEndpoint}/${id}`, { data });
  }

  // 删除资源
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`${this.baseEndpoint}/${id}`);
  }
} 
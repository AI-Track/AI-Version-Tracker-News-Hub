import { ApiService, ApiResponse } from '@/lib/api-client';

// 产品类型
export interface Product {
  id: string;
  name: string;
  type: string;
  version: string;
  lastUpdate: string;
  image: string;
  description: string;
}

// 产品详情类型
export interface ProductDetail extends Product {
  features: string[];
  versions: ProductVersion[];
}

// 产品版本类型
export interface ProductVersion {
  version: string;
  date: string;
  changes: string[];
}

// 产品服务类
export class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  // 获取所有产品
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    return this.getAll<Product>();
  }

  // 获取产品详情
  async getProductById(id: string): Promise<ApiResponse<ProductDetail>> {
    return this.getById<ProductDetail>(id);
  }

  // 获取产品版本历史
  async getProductVersions(id: string): Promise<ApiResponse<ProductVersion[]>> {
    return this.client.get<ProductVersion[]>(`${this.baseEndpoint}/${id}/versions`);
  }

  // 创建产品
  async createProduct(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    return this.create<Product>(product);
  }

  // 更新产品
  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.update<Product>(id, product);
  }

  // 删除产品
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }
}

// 创建产品服务实例
export const productService = new ProductService(); 
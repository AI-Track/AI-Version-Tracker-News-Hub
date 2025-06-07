import { ApiService, ApiResponse } from '@/lib/api-client';
import { 
  ProductListItem, 
  ProductDetail, 
  ProductVersion,
  // 为了向后兼容，仍然导入 Product 类型
  Product 
} from '@/types/product';

// 产品服务类
export class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  // 获取所有产品（返回产品列表项）
  async getAllProducts(): Promise<ApiResponse<ProductListItem[]>> {
    return this.getAll<ProductListItem>();
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
  async createProduct(product: Omit<ProductListItem, 'id'>): Promise<ApiResponse<ProductListItem>> {
    return this.create<ProductListItem>(product);
  }

  // 更新产品
  async updateProduct(id: string, product: Partial<ProductListItem>): Promise<ApiResponse<ProductListItem>> {
    return this.update<ProductListItem>(id, product);
  }

  // 删除产品
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  // 获取产品的特定版本信息
  async getProductVersion(id: string, version: string): Promise<ApiResponse<ProductVersion>> {
    return this.client.get<ProductVersion>(`${this.baseEndpoint}/${id}/versions/${version}`);
  }

  // 订阅产品更新
  async subscribeToProduct(id: string, email: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(`${this.baseEndpoint}/${id}/subscribe`, { data: { email } });
  }
}

// 创建产品服务实例
export const productService = new ProductService(); 
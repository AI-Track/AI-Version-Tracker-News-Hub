import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-start gap-6">
        {/* 产品图标 */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.icon || '/images/default-product-icon.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 产品信息 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">当前版本</p>
              <p className="font-medium">{product.currentVersion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">最近更新</p>
              <p className="font-medium">{new Date(product.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">类别</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">订阅数</p>
              <p className="font-medium">{product.subscriberCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 详细描述 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">产品介绍</h2>
        <div className="prose prose-sm max-w-none">
          {product.fullDescription}
        </div>
      </div>

      {/* 功能特点 */}
      {product.features && product.features.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">主要功能</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 
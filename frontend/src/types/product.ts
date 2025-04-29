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
  type: 'major' | 'minor' | 'patch';
  importance: 'high' | 'medium' | 'low';
  changes: string[];
  details: string;
  features: {
    title: string;
    description: string;
    image?: string;
  }[];
}

// 产品评分类型
export interface ProductRating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// 产品反馈类型
export interface ProductFeedback {
  id: string;
  productId: string;
  userId: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement';
  status: 'open' | 'in-progress' | 'completed' | 'declined';
  votes: {
    up: number;
    down: number;
  };
  createdAt: string;
}

// 订阅类型
export interface Subscription {
  id: string;
  productId: string;
  userId: string;
  preferences: {
    email: boolean;
    push: boolean;
    majorUpdates: boolean;
    minorUpdates: boolean;
    patchUpdates: boolean;
  };
  createdAt: string;
} 
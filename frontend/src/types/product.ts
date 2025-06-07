// 基础产品类型
export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  currentVersion: string;
  lastUpdated: string;
  icon: string;
  logo?: string; // 可选的大尺寸logo，用于详情页展示
}

// 产品列表项 (用于列表展示)
export interface ProductListItem extends BaseProduct {
  subscriberCount: number;
  rating?: number;
  ratingCount?: number;
}

// 产品统计信息
export interface ProductStats {
  totalUsers: number;
  averageRating: number;
  totalVersions: number;
  lastMonthUpdates: number;
}

// 产品详情 (用于详情页)
export interface ProductDetail extends ProductListItem {
  fullDescription: string;
  features: string[];
  versions: ProductVersion[];
  feedback: ProductFeedback[];
  settings: ProductSettings;
  stats: ProductStats;
}

// 产品版本类型
export interface ProductVersion {
  version: string;
  date: string;
  changes: string[];
  highlights?: string[];
  type: 'major' | 'minor' | 'patch';
  releaseNotes?: string;
  importance?: 'high' | 'medium' | 'low';
  details?: string;
  features?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
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
  userId: string;
  productId: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement';
  votes: {
    up: number;
    down: number;
  };
  createdAt: string;
  status: 'open' | 'in-progress' | 'completed' | 'declined';
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

export interface ProductSettings {
  notifications: {
    majorUpdates: boolean;
    minorUpdates: boolean;
    patchUpdates: boolean;
    newsAndAnnouncements: boolean;
  };
  display: {
    showBeta: boolean;
    showDeprecated: boolean;
    compactView: boolean;
  };
  subscription: {
    level: 'free' | 'pro' | 'enterprise';
    autoRenew: boolean;
    expiryDate: string;
  };
}

// 为了兼容性，保留旧的 Product 类型（但标记为废弃）
/** @deprecated 请使用 ProductListItem 或 ProductDetail */
export interface Product extends ProductDetail {
  // 保留一些旧字段以兼容现有代码
  version?: string;  // 兼容旧版本，请使用 currentVersion
  image?: string;    // 兼容旧版本，请使用 icon
  lastUpdate?: string; // 兼容旧版本，请使用 lastUpdated
} 
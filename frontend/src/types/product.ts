// 产品类型
export interface Product {
  id: string;
  name: string;
  logo: string;
  type: string;
  currentVersion: string;
  lastUpdate: string;
  description: string;
  features: string[];
  versions: ProductVersion[];
  feedback: ProductFeedback[];
  settings: ProductSettings;
  stats: {
    totalUsers: number;
    averageRating: number;
    totalVersions: number;
    lastMonthUpdates: number;
  };
  version?: string;  // 兼容旧版本
  image?: string;    // 兼容旧版本
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
  highlights?: string[];
  type: 'major' | 'minor' | 'patch';
  releaseNotes?: string;
  importance?: 'high' | 'medium' | 'low';
  details?: string;
  features?: Array<{
    title: string;
    description: string;
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
  rating: number;
  comment: string;
  date: string;
  version: string;
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
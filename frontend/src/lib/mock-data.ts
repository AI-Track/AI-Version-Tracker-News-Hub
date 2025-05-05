export interface ProductVersion {
  version: string;
  date: string;
  changes: string[];
  highlights?: string[];
  type: 'major' | 'minor' | 'patch';
  releaseNotes?: string;
}

export interface ProductFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  version: string;
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
}

export const mockProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'OpenAI GPT-4',
    logo: '/logo/openai.png',
    type: '聊天机器人',
    currentVersion: 'GPT-4 Turbo',
    lastUpdate: '2024-04-15',
    description: 'OpenAI 的 GPT-4 是一个先进的大型语言模型，能够理解和生成人类语言，支持多种任务。',
    features: [
      '更大的上下文窗口',
      '更快的响应速度',
      '更强的代码生成能力',
      '更好的多语言支持',
    ],
    versions: [
      {
        version: 'GPT-4 Turbo',
        date: '2024-04-15',
        type: 'major',
        changes: [
          '将上下文窗口扩展到 128K tokens',
          '响应速度提升 2 倍',
          '改进代码生成准确性',
          '新增 JSON 模式输出'
        ],
        highlights: ['128K Context Window', '2x Faster Response'],
        releaseNotes: '这是一个重大更新，显著提升了模型性能和功能'
      },
      {
        version: 'GPT-4 v2.5',
        date: '2024-03-20',
        type: 'minor',
        changes: [
          '优化多语言理解能力',
          '提升代码补全准确度',
          '改进数学推理能力'
        ]
      }
    ],
    feedback: [
      {
        id: 'f1',
        userId: 'user1',
        rating: 5,
        comment: '新版本的响应速度确实提升很多',
        date: '2024-04-16',
        version: 'GPT-4 Turbo'
      },
      {
        id: 'f2',
        userId: 'user2',
        rating: 4,
        comment: '代码生成能力有明显提升',
        date: '2024-04-15',
        version: 'GPT-4 Turbo'
      }
    ],
    settings: {
      notifications: {
        majorUpdates: true,
        minorUpdates: true,
        patchUpdates: false,
        newsAndAnnouncements: true
      },
      display: {
        showBeta: true,
        showDeprecated: false,
        compactView: false
      },
      subscription: {
        level: 'pro',
        autoRenew: true,
        expiryDate: '2025-04-15'
      }
    },
    stats: {
      totalUsers: 1000000,
      averageRating: 4.8,
      totalVersions: 15,
      lastMonthUpdates: 3
    }
  },
  '2': {
    id: '2',
    name: 'Claude 3',
    logo: '/images/anthropic.png',
    type: '聊天机器人',
    currentVersion: 'Claude 3 Opus',
    lastUpdate: '2024-03-10',
    description: 'Anthropic 的 Claude 3 是新一代 AI 助手，提供更强的推理能力和更好的多模态支持。',
    features: [
      '多模态理解能力',
      '更强的推理能力',
      '更好的上下文理解',
      '更准确的代码生成'
    ],
    versions: [
      {
        version: 'Claude 3 Opus',
        date: '2024-03-10',
        type: 'major',
        changes: [
          '推出全新的 Opus 模型',
          '支持图像理解和分析',
          '提升推理准确性',
          '优化长文本处理能力'
        ],
        highlights: ['Multimodal Support', 'Enhanced Reasoning'],
        releaseNotes: 'Claude 3 带来了革命性的多模态能力提升'
      }
    ],
    feedback: [
      {
        id: 'f3',
        userId: 'user3',
        rating: 5,
        comment: '多模态支持非常实用',
        date: '2024-03-15',
        version: 'Claude 3 Opus'
      }
    ],
    settings: {
      notifications: {
        majorUpdates: true,
        minorUpdates: true,
        patchUpdates: true,
        newsAndAnnouncements: true
      },
      display: {
        showBeta: false,
        showDeprecated: false,
        compactView: true
      },
      subscription: {
        level: 'enterprise',
        autoRenew: true,
        expiryDate: '2025-03-10'
      }
    },
    stats: {
      totalUsers: 500000,
      averageRating: 4.9,
      totalVersions: 8,
      lastMonthUpdates: 2
    }
  }
}; 
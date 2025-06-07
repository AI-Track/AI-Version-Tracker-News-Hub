import { 
  ProductDetail, 
  ProductVersion, 
  ProductFeedback, 
  ProductSettings 
} from '@/types/product';

export const mockProducts: Record<string, ProductDetail> = {
  '1': {
    id: '1',
    name: 'OpenAI GPT-4',
    description: 'OpenAI 的 GPT-4 是一个先进的大型语言模型，能够理解和生成人类语言，支持多种任务。',
    category: 'AI Assistant',
    type: 'chatbot',
    currentVersion: 'GPT-4 Turbo',
    lastUpdated: '2024-04-15',
    icon: '/logo/openai.png',
    logo: '/logo/openai-large.png',
    subscriberCount: 1500000,
    rating: 4.8,
    ratingCount: 25000,
    fullDescription: 'OpenAI 的 GPT-4 是目前最先进的大型语言模型之一，能够理解和生成人类语言，支持代码生成、文本创作、问答对话等多种任务。最新的 GPT-4 Turbo 版本在性能和功能上都有显著提升。',
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
        importance: 'high',
        changes: [
          '将上下文窗口扩展到 128K tokens',
          '响应速度提升 2 倍',
          '改进代码生成准确性',
          '新增 JSON 模式输出'
        ],
        highlights: ['128K Context Window', '2x Faster Response'],
        releaseNotes: '这是一个重大更新，显著提升了模型性能和功能',
        details: 'GPT-4 Turbo 是 OpenAI 的重大突破，在保持高质量输出的同时大幅提升了处理速度。',
        features: [
          {
            title: '扩展上下文窗口',
            description: '支持高达 128K tokens 的上下文长度，可处理更长的文档和对话'
          },
          {
            title: '性能优化',
            description: '响应速度提升 2 倍，大幅改善用户体验'
          }
        ]
      },
      {
        version: 'GPT-4 v2.5',
        date: '2024-03-20',
        type: 'minor',
        importance: 'medium',
        changes: [
          '优化多语言理解能力',
          '提升代码补全准确度',
          '改进数学推理能力'
        ],
        details: '针对性能进行的优化更新，重点改进了多语言支持和代码生成能力。'
      }
    ],
    feedback: [
      {
        id: 'f1',
        userId: 'user1',
        productId: '1',
        title: '响应速度提升',
        description: '新版本的响应速度确实提升很多',
        type: 'improvement',
        votes: {
          up: 5,
          down: 0
        },
        createdAt: '2024-04-16',
        status: 'completed'
      },
      {
        id: 'f2',
        userId: 'user2',
        productId: '1',
        title: '代码生成能力提升',
        description: '代码生成能力有明显提升',
        type: 'feature',
        votes: {
          up: 3,
          down: 1
        },
        createdAt: '2024-04-15',
        status: 'completed'
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
    name: 'GitHub Copilot',
    description: 'GitHub Copilot 是 AI 驱动的代码助手，可以帮助开发者更快速地编写代码。',
    category: 'Code Assistant',
    type: 'code',
    currentVersion: '2.0',
    lastUpdated: '2024-03-15',
    icon: '/logo/github-copilot.png',
    subscriberCount: 800000,
    rating: 4.6,
    ratingCount: 18000,
    fullDescription: 'GitHub Copilot 是由 GitHub、OpenAI 和 Microsoft 合作开发的 AI 编程助手，基于 OpenAI Codex 模型，可以根据上下文和注释自动生成代码建议。',
    features: [
      '智能代码补全',
      '支持多种编程语言',
      '上下文感知',
      '代码解释功能'
    ],
    versions: [
      {
        version: '2.0',
        date: '2024-03-15',
        type: 'major',
        importance: 'high',
        changes: [
          '新增代码解释功能',
          '支持更多编程语言',
          '改进代码建议准确性',
          '优化性能和响应速度'
        ],
        details: 'GitHub Copilot 2.0 带来了革命性的代码解释功能，让开发者更好地理解代码逻辑。'
      }
    ],
    feedback: [],
    settings: {
      notifications: {
        majorUpdates: true,
        minorUpdates: false,
        patchUpdates: false,
        newsAndAnnouncements: true
      },
      display: {
        showBeta: false,
        showDeprecated: false,
        compactView: true
      },
      subscription: {
        level: 'free',
        autoRenew: false,
        expiryDate: '2024-12-31'
      }
    },
    stats: {
      totalUsers: 800000,
      averageRating: 4.6,
      totalVersions: 8,
      lastMonthUpdates: 1
    }
  },
  '3': {
    id: '3',
    name: 'Cursor',
    description: 'Cursor 是 AI 驱动的代码编辑器，集成了强大的 AI 功能来提升开发效率。',
    category: 'Code Editor',
    type: 'code',
    currentVersion: '1.5',
    lastUpdated: '2024-03-18',
    icon: '/logo/cursor.webp',
    subscriberCount: 250000,
    rating: 4.7,
    ratingCount: 8500,
    fullDescription: 'Cursor 是一个专为开发者设计的 AI 代码编辑器，内置了强大的 AI 功能，可以帮助开发者更高效地编写、调试和优化代码。',
    features: [
      'AI 代码补全',
      '智能重构',
      '代码解释',
      '错误修复建议'
    ],
    versions: [
      {
        version: '1.5',
        date: '2024-03-18',
        type: 'minor',
        importance: 'medium',
        changes: [
          '新增代码重构功能',
          '改进 AI 补全准确性',
          '优化编辑器性能',
          '增加新的快捷键'
        ],
        details: 'Cursor 1.5 专注于提升开发体验，新增的代码重构功能让代码优化变得更加简单。'
      }
    ],
    feedback: [],
    settings: {
      notifications: {
        majorUpdates: true,
        minorUpdates: true,
        patchUpdates: true,
        newsAndAnnouncements: false
      },
      display: {
        showBeta: true,
        showDeprecated: true,
        compactView: false
      },
      subscription: {
        level: 'enterprise',
        autoRenew: true,
        expiryDate: '2025-03-18'
      }
    },
    stats: {
      totalUsers: 250000,
      averageRating: 4.7,
      totalVersions: 12,
      lastMonthUpdates: 2
    }
  }
}; 
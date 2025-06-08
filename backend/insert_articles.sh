#!/bin/bash

# MongoDB 测试文章数据插入脚本
docker exec -i ai-version-tracker-news-hub-mongodb-1 mongosh ai_tracker --eval "
// 清空现有文章
db.articles.deleteMany({});

// 插入测试文章数据
db.articles.insertMany([
  {
    title: 'OpenAI 发布 GPT-5：革命性的人工智能突破',
    content: 'OpenAI 今天正式发布了 GPT-5，这是该公司迄今为止最先进的大型语言模型。GPT-5 在多个基准测试中都表现出了显著的性能提升，特别是在推理能力、代码生成和多模态理解方面。新模型的主要特点包括：更强的推理能力、更大的上下文窗口、多模态能力、更快的响应速度。',
    excerpt: 'OpenAI 发布了革命性的 GPT-5 模型，在推理能力、多模态理解等方面实现重大突破。',
    cover_image: '/images/news/gpt5.jpg',
    author: {
      id: 'openai_team',
      name: 'OpenAI 团队',
      avatar: '/logo/openai.png'
    },
    category: 'AI模型',
    tags: ['OpenAI', 'GPT-5', '大语言模型', '人工智能'],
    status: 'published',
    publish_date: new Date('2024-06-08T10:00:00Z'),
    last_modified: new Date('2024-06-08T10:00:00Z'),
    read_time: 5,
    view_count: 15420,
    is_featured: true,
    priority: 10,
    source: {
      id: 'openai_blog',
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/'
    },
    crawl_data: {
      original_url: 'https://openai.com/blog/gpt-5-announcement',
      crawled_at: new Date('2024-06-08T09:30:00Z'),
      source_hash: 'abc123def456'
    },
    created_at: new Date('2024-06-08T09:30:00Z'),
    updated_at: new Date('2024-06-08T10:00:00Z')
  },
  {
    title: 'GitHub Copilot 推出企业版：AI 编程助手的新里程碑',
    content: 'GitHub 今天宣布推出 Copilot 企业版，为大型组织提供更强大的 AI 编程支持。新版本包含了多项专为企业环境设计的功能，包括代码安全扫描、合规性检查和团队协作工具。',
    excerpt: 'GitHub 推出 Copilot 企业版，为大型组织提供安全、合规的 AI 编程支持。',
    cover_image: '/images/news/copilot.jpg',
    author: {
      id: 'github_team',
      name: 'GitHub 团队',
      avatar: '/logo/github-copilot.png'
    },
    category: '开发工具',
    tags: ['GitHub', 'Copilot', '企业版', 'AI编程'],
    status: 'published',
    publish_date: new Date('2024-06-07T14:00:00Z'),
    last_modified: new Date('2024-06-07T14:00:00Z'),
    read_time: 4,
    view_count: 8930,
    is_featured: true,
    priority: 8,
    source: {
      id: 'github_blog',
      name: 'GitHub Blog',
      url: 'https://github.blog/'
    },
    crawl_data: {
      original_url: 'https://github.blog/copilot-enterprise-announcement',
      crawled_at: new Date('2024-06-07T13:30:00Z'),
      source_hash: 'def456ghi789'
    },
    created_at: new Date('2024-06-07T13:30:00Z'),
    updated_at: new Date('2024-06-07T14:00:00Z')
  },
  {
    title: 'AI 研究突破：新型神经网络架构提升效率 10 倍',
    content: '斯坦福大学和 MIT 的研究团队联合发布了一项重要研究成果，提出了一种名为 EffiNet 的新型神经网络架构，能够在保持相同精度的情况下将计算效率提升 10 倍。',
    excerpt: '斯坦福和 MIT 研究团队提出新型神经网络架构，计算效率提升 10 倍。',
    cover_image: '/images/news/research.jpg',
    author: {
      id: 'research_team',
      name: '研究团队',
      avatar: '/logo/research.png'
    },
    category: 'AI研究',
    tags: ['神经网络', '效率优化', '斯坦福', 'MIT'],
    status: 'published',
    publish_date: new Date('2024-06-06T16:00:00Z'),
    last_modified: new Date('2024-06-06T16:00:00Z'),
    read_time: 6,
    view_count: 12350,
    is_featured: false,
    priority: 7,
    source: {
      id: 'arxiv',
      name: 'arXiv',
      url: 'https://arxiv.org/'
    },
    crawl_data: {
      original_url: 'https://arxiv.org/abs/2024.06.001',
      crawled_at: new Date('2024-06-06T15:30:00Z'),
      source_hash: 'ghi789jkl012'
    },
    created_at: new Date('2024-06-06T15:30:00Z'),
    updated_at: new Date('2024-06-06T16:00:00Z')
  },
  {
    title: 'Anthropic 推出 Claude 3.0：挑战 GPT-4 的新对手',
    content: 'Anthropic 今天发布了 Claude 3.0，这是该公司最新的大型语言模型，在多项基准测试中与 OpenAI 的 GPT-4 不相上下，在某些任务中甚至表现更优。',
    excerpt: 'Anthropic 发布 Claude 3.0，在安全性和准确性方面挑战 GPT-4。',
    cover_image: '/images/news/claude.jpg',
    author: {
      id: 'anthropic_team',
      name: 'Anthropic 团队',
      avatar: '/logo/anthropic.png'
    },
    category: 'AI模型',
    tags: ['Anthropic', 'Claude', '大语言模型', '安全AI'],
    status: 'published',
    publish_date: new Date('2024-06-05T12:00:00Z'),
    last_modified: new Date('2024-06-05T12:00:00Z'),
    read_time: 4,
    view_count: 9876,
    is_featured: true,
    priority: 9,
    source: {
      id: 'anthropic_blog',
      name: 'Anthropic Blog',
      url: 'https://www.anthropic.com/news'
    },
    crawl_data: {
      original_url: 'https://www.anthropic.com/news/claude-3-announcement',
      crawled_at: new Date('2024-06-05T11:30:00Z'),
      source_hash: 'jkl012mno345'
    },
    created_at: new Date('2024-06-05T11:30:00Z'),
    updated_at: new Date('2024-06-05T12:00:00Z')
  }
]);

print('Articles inserted successfully');
print('Total articles:', db.articles.countDocuments());
"
// MongoDB 测试文章数据插入脚本
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'ai_tracker';

const testArticles = [
  {
    title: 'OpenAI 发布 GPT-5：革命性的人工智能突破',
    content: `OpenAI 今天正式发布了 GPT-5，这是该公司迄今为止最先进的大型语言模型。GPT-5 在多个基准测试中都表现出了显著的性能提升，特别是在推理能力、代码生成和多模态理解方面。

新模型的主要特点包括：
- 更强的推理能力：在复杂问题解决方面比 GPT-4 提升了 40%
- 更大的上下文窗口：支持高达 200K tokens 的上下文长度
- 多模态能力：原生支持文本、图像、音频和视频的理解和生成
- 更快的响应速度：推理速度比 GPT-4 快 3 倍

OpenAI CEO Sam Altman 表示："GPT-5 代表了我们在通用人工智能道路上的重要里程碑。我们相信这个模型将为各行各业带来前所未有的创新机会。"

该模型将首先向 ChatGPT Plus 和企业用户开放，预计在未来几个月内逐步扩展到更多用户群体。`,
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
    content: `GitHub 今天宣布推出 Copilot 企业版，为大型组织提供更强大的 AI 编程支持。新版本包含了多项专为企业环境设计的功能，包括代码安全扫描、合规性检查和团队协作工具。

企业版的主要特性：
- 代码安全分析：实时检测潜在的安全漏洞
- 合规性支持：确保代码符合企业标准和法规要求
- 团队协作：支持团队共享的代码模板和最佳实践
- 私有模型训练：基于企业内部代码库进行定制化训练

GitHub CEO Thomas Dohmke 表示："企业版 Copilot 将帮助大型组织在保持安全性和合规性的同时，充分利用 AI 的力量来提升开发效率。"

该服务现已向企业客户开放申请，定价为每用户每月 39 美元。`,
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
    content: `斯坦福大学和 MIT 的研究团队联合发布了一项重要研究成果，提出了一种名为 "EffiNet" 的新型神经网络架构，能够在保持相同精度的情况下将计算效率提升 10 倍。

这项突破性研究的关键创新包括：
- 动态权重分配：根据输入复杂度自动调整网络深度
- 稀疏激活模式：只激活最相关的神经元，大幅减少计算量
- 自适应精度控制：在不同任务中自动选择最优的数值精度

研究团队在多个基准数据集上进行了测试，结果显示 EffiNet 在图像分类、自然语言处理和语音识别任务中都表现出色。

论文第一作者 Dr. Sarah Chen 表示："这项技术有望让 AI 模型在移动设备和边缘计算环境中更加实用，为 AI 的普及应用开辟新的可能性。"

相关论文已在 Nature Machine Intelligence 期刊上发表，代码将在近期开源。`,
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
    content: `Anthropic 今天发布了 Claude 3.0，这是该公司最新的大型语言模型，在多项基准测试中与 OpenAI 的 GPT-4 不相上下，在某些任务中甚至表现更优。

Claude 3.0 的主要特点：
- 更强的安全性：内置更完善的安全机制，减少有害内容生成
- 更好的事实准确性：在事实性问答任务中准确率提升 25%
- 更长的上下文：支持 100K tokens 的上下文长度
- 更快的推理速度：响应时间比 Claude 2.0 快 50%

Anthropic CEO Dario Amodei 强调："我们的目标不仅是创造更强大的 AI，更要确保它是安全、可靠和有益的。Claude 3.0 在这些方面都有显著进步。"

该模型现已通过 Anthropic 的 API 向开发者开放，同时也将集成到该公司的 Claude 聊天应用中。`,
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
];

async function insertTestArticles() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('articles');
    
    // 清空现有数据
    await collection.deleteMany({});
    console.log('Cleared existing articles');
    
    // 插入测试数据
    const result = await collection.insertMany(testArticles);
    console.log(`Inserted ${result.insertedCount} articles`);
    
    // 验证插入的数据
    const count = await collection.countDocuments();
    console.log(`Total articles in database: ${count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

insertTestArticles();
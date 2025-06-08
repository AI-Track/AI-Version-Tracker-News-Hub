const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'ai_tracker';

async function insertMoreArticles() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('articles');
    
    // 生成更多测试文章
    const articles = [
      // 最新文章 (高发布时间)
      {
        title: "Claude 3.5 Sonnet 发布：Anthropic 的最新突破",
        content: "Anthropic 今天发布了 Claude 3.5 Sonnet，这是其最新的大语言模型。该模型在推理能力、代码生成和创意写作方面都有显著提升。Claude 3.5 Sonnet 采用了全新的训练方法，能够更好地理解上下文和用户意图。在多项基准测试中，Claude 3.5 Sonnet 都表现出色，特别是在复杂推理任务上超越了许多竞争对手。",
        excerpt: "Anthropic 发布 Claude 3.5 Sonnet，在推理、代码生成等方面实现重大突破...",
        cover_image: "https://picsum.photos/800/600?random=101",
        author: {
          id: "author_001",
          name: "AI研究员",
          avatar: "https://picsum.photos/100/100?random=1"
        },
        category: "AI模型",
        tags: ["Claude", "Anthropic", "大语言模型", "AI"],
        status: "published",
        publish_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
        last_modified: new Date(),
        read_time: 5,
        view_count: 1250,
        is_featured: false,
        priority: 8,
        source: {
          id: "anthropic_blog",
          name: "Anthropic Blog",
          url: "https://www.anthropic.com/blog"
        },
        crawl_data: {
          original_url: "https://www.anthropic.com/blog/claude-3-5-sonnet",
          crawled_at: new Date(),
          source_hash: "hash_101"
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 热门文章 (高阅读量)
      {
        title: "ChatGPT-4o 多模态能力全面解析",
        content: "OpenAI 的 ChatGPT-4o 引入了强大的多模态能力，能够同时处理文本、图像、音频和视频。这一突破性进展使得AI助手能够更自然地与用户交互。ChatGPT-4o 可以实时分析图像内容，理解语音指令，甚至生成高质量的视频内容。在教育、医疗、创意设计等领域，这些多模态能力开辟了全新的应用场景。",
        excerpt: "ChatGPT-4o 的多模态能力为AI交互带来革命性变化...",
        cover_image: "https://picsum.photos/800/600?random=102",
        author: {
          id: "author_002",
          name: "技术分析师",
          avatar: "https://picsum.photos/100/100?random=2"
        },
        category: "AI技术",
        tags: ["ChatGPT", "OpenAI", "多模态", "AI交互"],
        status: "published",
        publish_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
        last_modified: new Date(),
        read_time: 8,
        view_count: 5420,
        is_featured: true,
        priority: 9,
        source: {
          id: "openai_blog",
          name: "OpenAI Blog",
          url: "https://openai.com/blog"
        },
        crawl_data: {
          original_url: "https://openai.com/blog/chatgpt-4o-multimodal",
          crawled_at: new Date(),
          source_hash: "hash_102"
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // 趋势文章 (综合热度高)
      {
        title: "Google Gemini Ultra 挑战 GPT-4：AI竞争白热化",
        content: "Google 最新发布的 Gemini Ultra 在多项基准测试中超越了 GPT-4，标志着AI大模型竞争进入新阶段。Gemini Ultra 在数学推理、代码生成、多语言理解等方面表现出色。Google 声称这是首个在MMLU基准测试中超越人类专家水平的模型。这一突破可能会重新定义AI能力的边界，推动整个行业向前发展。",
        excerpt: "Google Gemini Ultra 在多项测试中超越 GPT-4，AI竞争升级...",
        cover_image: "https://picsum.photos/800/600?random=103",
        author: {
          id: "author_003",
          name: "AI观察者",
          avatar: "https://picsum.photos/100/100?random=3"
        },
        category: "行业动态",
        tags: ["Google", "Gemini", "GPT-4", "AI竞争"],
        status: "published",
        publish_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
        last_modified: new Date(),
        read_time: 6,
        view_count: 3890,
        is_featured: true,
        priority: 10,
        source: {
          id: "google_ai",
          name: "Google AI Blog",
          url: "https://ai.googleblog.com"
        },
        crawl_data: {
          original_url: "https://ai.googleblog.com/gemini-ultra-breakthrough",
          crawled_at: new Date(),
          source_hash: "hash_103"
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      
      {
        title: "Meta 开源 Llama 3：70B 参数模型免费使用",
        content: "Meta 宣布开源其最新的 Llama 3 模型，包括 70B 参数版本。这一举措将大大降低AI应用的门槛，让更多开发者和研究者能够使用先进的大语言模型。Llama 3 在性能上接近 GPT-4，但完全开源免费。Meta 希望通过开源策略推动AI技术的民主化，促进整个生态系统的发展。",
        excerpt: "Meta 开源 Llama 3 70B 模型，AI技术民主化迈出重要一步...",
        cover_image: "https://picsum.photos/800/600?random=104",
        author: {
          id: "author_004",
          name: "开源倡导者",
          avatar: "https://picsum.photos/100/100?random=4"
        },
        category: "开源AI",
        tags: ["Meta", "Llama", "开源", "大语言模型"],
        status: "published",
        publish_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
        last_modified: new Date(),
        read_time: 7,
        view_count: 2760,
        is_featured: false,
        priority: 7,
        source: {
          id: "meta_ai",
          name: "Meta AI",
          url: "https://ai.meta.com"
        },
        crawl_data: {
          original_url: "https://ai.meta.com/llama-3-release",
          crawled_at: new Date(),
          source_hash: "hash_104"
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      
      {
        title: "AI 代码助手大比拼：GitHub Copilot vs Cursor vs Claude",
        content: "随着AI代码助手的普及，开发者面临越来越多的选择。GitHub Copilot 作为先驱，拥有庞大的用户基础；Cursor 以其智能的代码编辑能力脱颖而出；Claude 则在代码解释和重构方面表现优异。本文深入比较这三款工具的优缺点，帮助开发者选择最适合的AI编程伙伴。",
        excerpt: "深度对比三大AI代码助手，为开发者提供选择指南...",
        cover_image: "https://picsum.photos/800/600?random=105",
        author: {
          id: "author_005",
          name: "程序员小王",
          avatar: "https://picsum.photos/100/100?random=5"
        },
        category: "开发工具",
        tags: ["GitHub Copilot", "Cursor", "Claude", "代码助手"],
        status: "published",
        publish_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4天前
        last_modified: new Date(),
        read_time: 10,
        view_count: 4150,
        is_featured: false,
        priority: 6,
        source: {
          id: "dev_community",
          name: "开发者社区",
          url: "https://dev.to"
        },
        crawl_data: {
          original_url: "https://dev.to/ai-coding-tools-comparison",
          crawled_at: new Date(),
          source_hash: "hash_105"
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      
      {
        title: "Midjourney V6 发布：AI 图像生成进入新纪元",
        content: "Midjourney 发布了其第六代图像生成模型，在图像质量、细节表现和风格控制方面都有显著提升。V6 版本能够生成更加逼真的人物肖像，更好地理解复杂的文本提示，并支持更多样化的艺术风格。这一更新进一步巩固了 Midjourney 在AI艺术创作领域的领先地位。",
        excerpt: "Midjourney V6 带来图像生成技术的重大突破...",
        cover_image: "https://picsum.photos/800/600?random=106",
        author: {
          id: "author_006",
          name: "数字艺术家",
          avatar: "https://picsum.photos/100/100?random=6"
        },
        category: "AI艺术",
        tags: ["Midjourney", "图像生成", "AI艺术", "创意工具"],
        status: "published",
        publish_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6天前
        last_modified: new Date(),
        read_time: 5,
        view_count: 3200,
        is_featured: false,
        priority: 5,
        source: {
          id: "midjourney_blog",
          name: "Midjourney Blog",
          url: "https://midjourney.com/blog"
        },
        crawl_data: {
          original_url: "https://midjourney.com/blog/v6-release",
          crawled_at: new Date(),
          source_hash: "hash_106"
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    // 插入文章
    const result = await collection.insertMany(articles);
    console.log(`✅ 成功插入 ${result.insertedCount} 篇文章`);
    
    // 显示插入的文章信息
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (阅读量: ${article.view_count}, 优先级: ${article.priority})`);
    });
    
  } catch (error) {
    console.error('❌ 插入文章失败:', error);
  } finally {
    await client.close();
  }
}

insertMoreArticles();
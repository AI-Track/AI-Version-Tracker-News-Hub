const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'ai_tracker';

async function insert20Articles() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('articles');
    
    // 先清空现有文章
    await collection.deleteMany({});
    console.log('Cleared existing articles');
    
    // 生成20条测试文章，标题前加ID
    const articles = [];
    
    const baseArticles = [
      {
        title: "Claude 3.5 Sonnet 发布：Anthropic 的最新突破",
        category: "AI模型",
        tags: ["Claude", "Anthropic", "大语言模型", "AI"],
        content: "Anthropic 今天发布了 Claude 3.5 Sonnet，这是其最新的大语言模型。该模型在推理能力、代码生成和创意写作方面都有显著提升。",
        priority: 8,
        view_count: 1250
      },
      {
        title: "ChatGPT-4o 多模态能力全面升级",
        category: "AI技术",
        tags: ["ChatGPT", "OpenAI", "多模态", "升级"],
        content: "OpenAI 宣布 ChatGPT-4o 在图像、视频和音频处理方面取得重大进展，支持更复杂的多模态交互。",
        priority: 9,
        view_count: 5420
      },
      {
        title: "Google Gemini Ultra 对战 GPT-4：AI模型新较量",
        category: "行业动态",
        tags: ["Google", "Gemini", "GPT-4", "AI竞争"],
        content: "Google 最新发布的 Gemini Ultra 在多项基准测试中与 GPT-4竞争激烈，AI模型竞争进入新阶段。",
        priority: 10,
        view_count: 3890
      },
      {
        title: "Meta 发布 Llama 3：70B 参数开源模型震撼登场",
        category: "开源AI",
        tags: ["Meta", "Llama", "开源", "大语言模型"],
        content: "Meta 发布了最新的开源大语言模型 Llama 3，拥有 70B 参数，在性能上大幅提升。",
        priority: 7,
        view_count: 2760
      },
      {
        title: "AI编程助手大比拼：GitHub Copilot vs Cursor vs Claude",
        category: "开发工具",
        tags: ["编程", "AI助手", "开发效率", "工具"],
        content: "深度对比三大AI编程助手的功能特点，帮助开发者选择最适合的工具。",
        priority: 6,
        view_count: 4150
      }
    ];
    
    // 生成20条文章
    for (let i = 0; i < 20; i++) {
      const baseIndex = i % baseArticles.length;
      const base = baseArticles[baseIndex];
      
      articles.push({
        title: `【${i}】${base.title}`,
        content: base.content + ` 这是第${i}条测试数据，用于验证分页功能。`,
        excerpt: `${base.title.substring(0, 50)}...`,
        cover_image: `https://picsum.photos/800/600?random=${100 + i}`,
        author: {
          id: `author_${String(i % 5).padStart(3, '0')}`,
          name: `AI研究员${i % 5 + 1}`,
          avatar: `https://picsum.photos/100/100?random=${i % 5 + 1}`
        },
        category: base.category,
        tags: base.tags,
        status: "published",
        publish_date: new Date(Date.now() - (i % 10) * 24 * 60 * 60 * 1000), // 0-9天前随机
        last_modified: new Date(),
        read_time: 5 + (i % 8),
        view_count: base.view_count + (i * 100),
        is_featured: i < 3, // 前3条设为特色
        priority: base.priority + (i % 3),
        source: {
          id: `source_${i % 3 + 1}`,
          name: `AI News Source ${i % 3 + 1}`,
          url: `https://example${i % 3 + 1}.com`
        },
        crawl_data: {
          original_url: `https://example.com/article-${i}`,
          crawled_at: new Date(),
          source_hash: `hash_${100 + i}`
        },
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // 插入文章
    const result = await collection.insertMany(articles);
    console.log(`插入了 ${result.insertedCount} 条文章`);
    
    // 验证插入结果
    const count = await collection.countDocuments();
    console.log(`数据库中总共有 ${count} 条文章`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

insert20Articles();
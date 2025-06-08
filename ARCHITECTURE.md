# AI Version Tracker News Hub - 后端架构设计

## 🎯 项目目标

构建一个现代化、可扩展的 AI 新闻追踪平台，支持：
- 用户认证与权限管理
- 新闻源管理与内容抓取
- 产品版本追踪
- 实时数据更新
- 管理后台功能

## 🏗️ 整体架构

### 微服务架构
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Backend       │
│   (Next.js)     │◄──►│   (Nginx/Kong)   │◄──►│   Services      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                       ┌─────────────────┐              │
                       │   Data Layer    │◄─────────────┘
                       │   (Multi-DB)    │
                       └─────────────────┘
```

### 服务拆分策略
- **认证服务 (auth-service)**: 用户登录、JWT、权限管理
- **新闻服务 (news-service)**: 文章、轮播、分页
- **管理服务 (admin-service)**: 新闻源管理、配置
- **产品服务 (product-service)**: 产品、版本追踪
- **爬虫服务 (crawler-service)**: 数据抓取、处理

## 📊 数据库设计

### MongoDB 文档设计
```javascript
// 新闻文章集合
articles: {
  _id: ObjectId,
  title: String,
  content: String,
  excerpt: String,
  coverImage: String,
  author: {
    id: String,
    name: String,
    avatar: String
  },
  category: String,
  tags: [String],
  status: Enum['draft', 'published', 'archived'],
  publishDate: Date,
  lastModified: Date,
  readTime: Number,
  viewCount: Number,
  isFeatured: Boolean,
  priority: Number,
  source: {
    id: String,
    name: String,
    url: String
  },
  crawlData: {
    originalUrl: String,
    crawledAt: Date,
    sourceHash: String
  }
}

// 产品集合
products: {
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  type: String,
  currentVersion: String,
  lastUpdated: Date,
  icon: String,
  logo: String,
  subscriberCount: Number,
  rating: Number,
  ratingCount: Number,
  fullDescription: String,
  features: [String],
  stats: {
    totalUsers: Number,
    averageRating: Number,
    totalVersions: Number,
    lastMonthUpdates: Number
  },
  isActive: Boolean,
  createdAt: Date
}

// 产品版本集合
product_versions: {
  _id: ObjectId,
  productId: ObjectId,
  version: String,
  date: Date,
  changes: [String],
  highlights: [String],
  type: Enum['major', 'minor', 'patch'],
  importance: Enum['high', 'medium', 'low'],
  details: String,
  features: [{
    title: String,
    description: String,
    image: String
  }],
  releaseNotes: String
}
```

### MySQL 关系数据设计
```sql
-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 新闻源管理表
CREATE TABLE news_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('rss', 'api', 'web') NOT NULL,
    status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    crawl_interval INT DEFAULT 3600, -- 抓取间隔(秒)
    last_crawl_at TIMESTAMP NULL,
    next_crawl_at TIMESTAMP NULL,
    crawl_config JSON, -- 爬虫配置
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 系统配置表
CREATE TABLE system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 认证与权限设计

### JWT Token 结构
```json
{
  "sub": "user_id",
  "username": "admin",
  "role": "admin",
  "permissions": ["read", "write", "admin"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

### 权限控制矩阵
| 资源 | 游客 | 用户 | 编辑 | 管理员 |
|------|------|------|------|--------|
| 读取新闻 | ✓ | ✓ | ✓ | ✓ |
| 读取产品 | ✓ | ✓ | ✓ | ✓ |
| 创建文章 | ✗ | ✗ | ✓ | ✓ |
| 管理新闻源 | ✗ | ✗ | ✓ | ✓ |
| 用户管理 | ✗ | ✗ | ✗ | ✓ |

## 🚀 API 设计规范

### RESTful API 设计
```
# 认证相关
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile

# 新闻相关
GET    /api/v1/news/articles          # 文章列表
GET    /api/v1/news/articles/:id      # 文章详情
GET    /api/v1/news/featured          # 轮播文章
POST   /api/v1/news/articles          # 创建文章
PUT    /api/v1/news/articles/:id      # 更新文章
DELETE /api/v1/news/articles/:id      # 删除文章

# 产品相关
GET    /api/v1/products               # 产品列表
GET    /api/v1/products/:id           # 产品详情
GET    /api/v1/products/:id/versions  # 产品版本列表
POST   /api/v1/products               # 创建产品
PUT    /api/v1/products/:id           # 更新产品

# 管理相关
GET    /api/v1/admin/news-sources     # 新闻源列表
POST   /api/v1/admin/news-sources     # 创建新闻源
PUT    /api/v1/admin/news-sources/:id # 更新新闻源
DELETE /api/v1/admin/news-sources/:id # 删除新闻源
POST   /api/v1/admin/crawl/trigger    # 手动触发爬虫
```

### 响应格式标准
```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🕷️ 爬虫服务设计

### 爬虫架构
```python
# 爬虫服务架构
├── crawlers/
│   ├── base_crawler.py      # 基础爬虫类
│   ├── rss_crawler.py       # RSS爬虫
│   ├── api_crawler.py       # API爬虫
│   └── web_crawler.py       # 网页爬虫
├── processors/
│   ├── content_processor.py # 内容处理
│   ├── dedup_processor.py   # 去重处理
│   └── nlp_processor.py     # NLP处理
├── schedulers/
│   ├── celery_scheduler.py  # 任务调度
│   └── cron_scheduler.py    # 定时任务
└── config/
    └── crawler_config.py    # 爬虫配置
```

### 任务队列设计
```python
# Celery 任务定义
@celery.task
def crawl_news_source(source_id):
    """爬取指定新闻源"""
    pass

@celery.task
def process_article_content(article_id):
    """处理文章内容"""
    pass

@celery.task
def update_product_versions():
    """更新产品版本信息"""
    pass
```

## 📈 性能优化策略

### 缓存策略
```yaml
缓存层级:
  L1 - Redis: 热点数据、会话、计数器
  L2 - CDN: 静态资源、图片
  L3 - 应用缓存: 查询结果、计算结果

缓存策略:
  文章列表: 5分钟
  文章详情: 1小时
  产品信息: 30分钟
  用户会话: 24小时
```

### 数据库优化
```javascript
// MongoDB 索引策略
db.articles.createIndex({ "status": 1, "publishDate": -1 })
db.articles.createIndex({ "category": 1, "isFeatured": -1 })
db.articles.createIndex({ "tags": 1 })
db.products.createIndex({ "type": 1, "isActive": 1 })
```

## 🔄 部署与扩展

### Docker 容器化
```yaml
services:
  # 后端服务
  auth-service:
    image: ai-tracker/auth-service:latest
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
  
  news-service:
    image: ai-tracker/news-service:latest
    environment:
      - MONGO_URI=mongodb://mongodb:27017/ai_news
      - REDIS_HOST=redis
  
  # 爬虫服务
  crawler-service:
    image: ai-tracker/crawler-service:latest
    environment:
      - CELERY_BROKER=redis://redis:6379/0
      - MONGO_URI=mongodb://mongodb:27017/ai_news
```

### 水平扩展策略
- **API 网关**: 负载均衡、限流、熔断
- **服务发现**: Consul/Etcd
- **监控告警**: Prometheus + Grafana + AlertManager
- **日志聚合**: ELK Stack

## 🛡️ 安全策略

### 安全措施
- **API 安全**: JWT认证、RBAC权限控制
- **数据安全**: 密码哈希、敏感数据加密
- **网络安全**: HTTPS、防火墙、WAF
- **输入验证**: 参数校验、SQL注入防护
- **访问控制**: IP白名单、频率限制

## 📝 开发规范

### 代码结构
```
backend/
├── cmd/                 # 应用入口
├── internal/            # 私有代码
│   ├── handler/        # HTTP处理器
│   ├── service/        # 业务逻辑
│   ├── repository/     # 数据访问
│   ├── model/          # 数据模型
│   └── middleware/     # 中间件
├── pkg/                # 公共代码
├── config/             # 配置文件
├── docs/               # API文档
└── tests/              # 测试文件
```

### 开发流程
1. **需求分析** → **API设计** → **数据库设计**
2. **编码实现** → **单元测试** → **集成测试**
3. **代码审查** → **部署测试** → **生产发布**

## 🎯 实施计划

### Phase 1: 基础设施 (1-2周)
- [ ] 搭建开发环境
- [ ] 数据库设计与初始化
- [ ] 基础框架搭建
- [ ] Docker 容器化

### Phase 2: 核心功能 (2-3周)
- [ ] 用户认证系统
- [ ] 新闻API开发
- [ ] 产品管理API
- [ ] 基础爬虫功能

### Phase 3: 管理功能 (1-2周)
- [ ] 新闻源管理
- [ ] 管理后台API
- [ ] 权限控制系统

### Phase 4: 优化完善 (1周)
- [ ] 性能优化
- [ ] 监控部署
- [ ] 文档完善
- [ ] 测试覆盖 
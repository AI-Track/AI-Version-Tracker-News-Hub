# 前端路由结构整理

## 当前路由结构 (Next.js Pages Router)

### 页面路由
```
/                           # 首页 (轮播 + 新闻列表)
/news                       # 新闻列表页面
/news/[id]                  # 新闻详情页面
/products                   # 产品列表页面
/products/[id]              # 产品详情页面
/products/[id]/feedback     # 产品反馈页面
/products/[id]/settings     # 产品设置页面
/products/[id]/versions/[version] # 产品版本详情页面
/auth/login                 # 登录页面
/admin                      # 管理后台首页
/admin/articles             # 文章管理
/admin/news-sources         # 新闻源管理
/admin/content              # 内容管理
/admin/ai-updates           # AI更新管理
```

### 已删除的页面
- ~~`/versions`~~ - 独立版本页面 (已删除，功能整合到产品详情中)

## 路由规范和建议

### 1. RESTful 路由设计
```
GET    /products              # 产品列表
GET    /products/[id]         # 产品详情
GET    /products/[id]/versions # 产品版本列表
GET    /products/[id]/versions/[version] # 版本详情
POST   /products/[id]/subscribe # 订阅产品更新
```

### 2. 嵌套路由结构
```
/products/
  ├── index.tsx              # 产品列表
  └── [id]/
      ├── index.tsx          # 产品详情
      ├── feedback.tsx       # 产品反馈
      ├── settings.tsx       # 产品设置
      └── versions/
          └── [version].tsx  # 版本详情
```

### 3. 管理后台路由
```
/admin/
  ├── index.tsx              # 管理后台首页
  ├── articles/              # 文章管理模块
  ├── news-sources/          # 新闻源管理
  ├── content/               # 内容管理
  └── ai-updates/            # AI更新管理
```

## 数据类型一致性问题

### 需要修复的问题
1. **Product 类型字段重复**：`lastUpdate` vs `lastUpdated`
2. **版本字段不一致**：`version` vs `currentVersion`
3. **图片字段重复**：`image` vs `icon` vs `logo`
4. **Store 中的 Product 类型简化，缺少必要字段**

### 建议的统一类型定义
```typescript
// 基础产品类型
interface BaseProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  currentVersion: string;
  lastUpdated: string;
  icon: string;
  logo?: string; // 可选的大尺寸logo
}

// 产品列表项 (用于列表展示)
interface ProductListItem extends BaseProduct {
  subscriberCount: number;
  rating?: number;
  ratingCount?: number;
}

// 产品详情 (用于详情页)
interface ProductDetail extends ProductListItem {
  fullDescription: string;
  features: string[];
  versions: ProductVersion[];
  feedback: ProductFeedback[];
  settings: ProductSettings;
  stats: ProductStats;
}
```

## 下一步行动计划

1. ✅ 删除独立的 `/versions` 页面
2. ✅ 统一 Product 类型定义
3. ✅ 更新 Store 中的类型
4. ✅ 修复所有引用不一致的地方
5. ✅ 添加缺失的版本列表路由 (`/products/[id]/versions`)
6. ✅ 优化路由导航逻辑

## 已完成的改进

### 1. 类型系统重构
- 创建了清晰的类型层次：`BaseProduct` → `ProductListItem` → `ProductDetail`
- 统一了字段命名：`currentVersion`, `lastUpdated`, `icon`
- 保留向后兼容的 `Product` 类型（标记为废弃）

### 2. 路由结构完善
- 添加了 `/products/[id]/versions` 版本列表页面
- 优化了导航流程：产品列表 → 版本列表 → 版本详情
- 修复了版本历史按钮的跳转逻辑

### 3. 数据一致性
- Store 中使用统一的 `ProductListItem` 类型
- Mock 数据包含完整的字段信息（评分、订阅数等）
- 修复了字段名不一致的问题 
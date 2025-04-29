# AI News & Version Tracker Frontend

基于 Next.js 和 TypeScript 的现代化 AI 产品更新追踪平台。

## 技术栈

- 包管理器: pnpm@10.10.0
- 框架: Next.js 14.1.0
- UI 框架: shadcn/ui + Tailwind CSS
- 状态管理: Zustand
- 表单处理: React Hook Form + Zod
- 类型检查: TypeScript
- 组件库: Radix UI
- 图标: Lucide Icons

## 项目结构

```
frontend/
├── src/                    # 源代码目录
│   ├── components/         # React 组件
│   │   ├── common/        # 通用组件
│   │   ├── layout/        # 布局组件
│   │   ├── products/      # 产品相关组件
│   │   ├── ratings/       # 评分相关组件
│   │   ├── subscription/  # 订阅相关组件
│   │   ├── versions/      # 版本相关组件
│   │   └── ui/           # UI 基础组件 (shadcn/ui)
│   ├── hooks/             # 自定义 React Hooks
│   ├── i18n/              # 国际化资源
│   ├── lib/               # 工具库和辅助函数
│   ├── pages/             # Next.js 页面
│   │   ├── news/          # 新闻页面
│   │   ├── products/      # 产品相关页面 
│   │   │   ├── [id]/ 
│   │   │   │   ├── [version]/      # 版本详情页面
│   │   │   │   ├── index.tsx        # 版本列表入口
│   │   │   │   ├── versions.tsx     # 版本列表页面
│   │   │   │   └── [version].tsx    # 版本详情页面
│   │   │   └─── id  # 产品详情页面
│   │   ├── versions/      # 版本相关页面
│   │   ├── _app.tsx        # 全局应用组件
│   │   ├── index.tsx        # 入口文件
│   │   ├── news.tsx        # 新闻页面
│   │   ├── products.tsx    # 产品列表页面
│   │   └── versions.tsx    # 版本列表页面
│   ├── services/          # API 服务层
│   ├── store/             # Zustand 状态管理
│   ├── styles/            # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 通用工具函数
│   ├── i18n/             # 国际化资源
│   └── constants/        # 常量定义
├── public/                # 静态资源
└── ...配置文件
```

## 主要功能

- 🔄 产品管理
  - 产品列表展示
  - 产品详情页面
  - 产品版本管理
  - 产品评分系统

- 📊 版本追踪
  - 版本时间线
  - 版本详情页面
  - 版本更新通知

- 👥 用户交互
  - 产品订阅
  - 评分和反馈
  - 通知偏好设置

- 🌐 国际化
  - 中英文支持
  - 可扩展的语言配置

## 开发环境设置

```bash
# 安装依赖
pnpm install

# 开发环境运行
pnpm dev

# 构建生产版本
pnpm build

# 生产环境运行
pnpm start

# 代码检查
pnpm lint
```

## 开发指南

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化

### 组件开发
- 使用 shadcn/ui 组件库
- 遵循原子设计原则
- 确保组件可重用性

### 样式指南
- 使用 Tailwind CSS 进行样式开发
- 遵循响应式设计原则
- 保持一致的设计语言

## 项目特点

1. 现代化技术栈
   - 使用 pnpm 作为包管理器，提供更快的安装速度和更好的磁盘空间利用
   - 基于 Next.js 14 的 App Router 和 React 18
   - 完整的 TypeScript 支持

2. 组件化设计
   - 基于 shadcn/ui 的可定制组件系统
   - 模块化的组件结构
   - 可重用的自定义 Hooks

3. 优秀的开发体验
   - 热重载开发环境
   - ESLint 代码规范检查
   - TypeScript 类型检查

4. 性能优化
   - 基于路由的代码分割
   - 静态生成和服务端渲染
   - 优化的图片处理

## 环境要求

- Node.js >= 18.17.0
- pnpm >= 10.10.0

## 浏览器支持

- Chrome >= 91
- Firefox >= 90
- Safari >= 14
- Edge >= 91

## 环境变量

创建 `.env.local` 文件并设置以下变量：

```env
NEXT_PUBLIC_API_URL=你的API地址
```

## 部署

项目可以部署到任何支持 Next.js 的平台：

- Vercel (推荐)
- Netlify
- 自托管服务器

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
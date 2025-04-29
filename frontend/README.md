# AI News & Version Tracker Frontend

这是一个用于追踪 AI 产品更新和新闻的前端项目。

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI

## 开发环境要求

- Node.js 18+
- pnpm 10+

## 项目设置

1. 安装依赖：

```bash
pnpm install
```

2. 启动开发服务器：

```bash
pnpm dev
```

3. 构建项目：

```bash
pnpm build
```

4. 启动生产服务器：

```bash
pnpm start
```

## 项目结构

```
frontend/
├── src/
│   ├── components/     # 可重用组件
│   │   ├── ui/        # UI 组件
│   │   └── layout/    # 布局组件
│   ├── pages/         # 页面组件
│   ├── styles/        # 全局样式
│   ├── lib/          # 工具函数
│   └── hooks/        # 自定义 Hooks
├── public/           # 静态资源
└── ...配置文件
```

## 主要功能

- 🔄 AI 产品版本追踪
- 📰 AI 相关新闻
- 📊 产品更新统计
- 🎯 个性化追踪
- 📱 响应式设计

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

## 部署

项目可以部署到任何支持 Next.js 的平台：

- Vercel (推荐)
- Netlify
- 自托管服务器

## 环境变量

创建 `.env.local` 文件并设置以下变量：

```env
NEXT_PUBLIC_API_URL=你的API地址
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT License](LICENSE) 
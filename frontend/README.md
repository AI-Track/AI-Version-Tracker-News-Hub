# AI Tracker 前端项目文档

## 项目介绍
AI Tracker 是一个专注于追踪 AI 产品更新和变化的平台，帮助用户及时了解 AI 领域的最新动态。

## 技术栈
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

## 功能模块

### 1. 产品追踪 (`/products`)
- 产品列表展示
- 类别筛选
- 产品详情
- 邮件订阅功能

### 2. 版本更新 (`/versions`)
- 版本历史记录
- 更新时间线
- 功能变更说明

### 3. 新闻动态 (`/news`)
- AI 产品新闻
- 行业动态

### 4. 订阅系统
- 邮件订阅表单
- 订阅确认流程
- 更新通知

## 项目结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx      # 全局布局组件
│   │   │   ├── Navbar.tsx      # 导航栏组件
│   │   │   └── Footer.tsx      # 页脚组件
│   │   ├── subscription/
│   │   │   └── SubscribeDialog.tsx  # 订阅对话框组件
│   │   └── ui/                 # shadcn/ui 组件
│   ├── pages/
│   │   ├── index.tsx           # 首页
│   │   ├── products.tsx        # 产品追踪页
│   │   └── versions.tsx        # 版本更新页
│   ├── styles/
│   │   └── globals.css         # 全局样式
│   ├── hooks/                  # 自定义 Hooks
│   └── lib/                    # 工具函数和类型定义
├── public/                     # 静态资源
└── components.json             # shadcn/ui 配置
```

## 组件说明

### Layout 组件
- 实现响应式布局
- 固定顶部导航
- 自适应内容区
- 固定底部页脚

### 产品页面
- 产品卡片展示
- 类别筛选功能
- 订阅更新按钮
- 响应式网格布局

### 订阅对话框
- 邮箱输入验证
- 表单提交处理
- 成功/失败提示
- 优雅的交互动画

## 待实现功能

### 1. 后端集成
- 订阅 API 接口
- 数据持久化
- 邮件发送服务

### 2. 用户功能
- 用户认证
- 个人订阅管理
- 通知偏好设置

### 3. 产品详情
- 详细信息展示
- 版本历史
- 用户评论

## 开发指南

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

### 添加新的 shadcn/ui 组件
```bash
npx shadcn@latest add [component-name]
```

## 样式指南

### 颜色系统
- 主色：primary (shadcn/ui)
- 背景：background
- 文字：foreground
- 次要文字：muted-foreground

### 间距规范
- 页面内边距：px-4 py-8
- 组件间距：space-y-4 / gap-8
- 卡片内边距：p-6

### 响应式断点
- 移动端：默认
- 平板：md (768px)
- 桌面：lg (1024px)

## 注意事项
1. 组件开发遵循 shadcn/ui 设计规范
2. 使用 TypeScript 类型检查
3. 保持代码格式统一
4. 遵循 React 最佳实践

## 贡献指南
1. 创建功能分支
2. 提交代码更改
3. 创建 Pull Request
4. 等待代码审查

## 联系方式
- GitHub Issues
- 项目讨论区

## 许可证
MIT License 
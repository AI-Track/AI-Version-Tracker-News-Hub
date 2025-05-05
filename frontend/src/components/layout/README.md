# Layout Components

本文档描述了 AI News 项目中使用的布局组件。
This document describes the layout components used in the AI News project.

## 组件结构 / Component Structure

```
components/layout/
├── admin/
│   ├── AdminLayout.tsx   # 管理后台主布局 / Admin dashboard main layout
│   ├── Header.tsx        # 管理后台顶部导航 / Admin top navigation
│   └── Sidebar.tsx       # 管理后台侧边栏 / Admin sidebar
└── main/
    ├── MainLayout.tsx    # 主站布局 / Main site layout
    ├── Navbar.tsx        # 主站导航栏 / Main site navigation
    └── Footer.tsx        # 主站页脚 / Main site footer
```

## 管理后台布局 / Admin Layout

### AdminLayout

主要管理后台布局组件，包含以下功能：
Main admin dashboard layout component with the following features:

- 响应式设计 / Responsive design
- 可折叠侧边栏 / Collapsible sidebar
- 固定顶部导航 / Fixed top navigation
- 滚动内容区域 / Scrollable content area

```tsx
import { AdminLayout } from '@/components/layout/admin/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div>Page content</div>
    </AdminLayout>
  );
}
```

### Sidebar

管理后台侧边栏组件，特点：
Admin sidebar component features:

- 可折叠/展开 / Collapsible/Expandable
- 工具提示支持 / Tooltip support
- 活动项目高亮 / Active item highlighting
- 平滑过渡动画 / Smooth transition animations

### Header

管理后台顶部导航组件，包含：
Admin header component includes:

- 用户菜单 / User menu
- 通知中心 / Notifications
- 快速操作 / Quick actions
- 返回主站链接 / Back to main site link

## 主站布局 / Main Site Layout

### MainLayout

主站布局组件，特点：
Main site layout component features:

- 响应式设计 / Responsive design
- 深色模式支持 / Dark mode support
- 多语言支持 / Multi-language support
- SEO 优化 / SEO optimization

## 样式指南 / Styling Guidelines

所有布局组件都使用：
All layout components use:

- Tailwind CSS
- shadcn/ui 组件库 / shadcn/ui component library
- CSS 变量主题系统 / CSS variable theming system

### 主题定制 / Theme Customization

主题变量位于：
Theme variables are located in:

```
src/styles/globals.css
tailwind.config.js
```

## 最佳实践 / Best Practices

1. 使用语义化的类名 / Use semantic class names
2. 遵循移动优先原则 / Follow mobile-first approach
3. 保持组件的单一职责 / Keep components single-responsibility
4. 使用 TypeScript 类型定义 / Use TypeScript type definitions
5. 添加适当的注释和文档 / Add appropriate comments and documentation 
# AdminLayout 组件 / AdminLayout Component

## 描述 / Description

管理后台的主布局组件，提供统一的页面结构和布局管理。
Main layout component for the admin dashboard, providing unified page structure and layout management.

### 功能特点 / Features

- 响应式布局 / Responsive layout
- 固定顶部导航 / Fixed top navigation
- 可折叠侧边栏 / Collapsible sidebar
- 滚动内容区域 / Scrollable content area

## 属性 / Props

```typescript
interface AdminLayoutProps {
  children: ReactNode;  // 页面内容 / Page content
}
```

## 依赖项 / Dependencies

```typescript
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
```

## 使用示例 / Usage Example

```tsx
import { AdminLayout } from '@/components/layout/admin/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="p-4">
        <h1>管理后台页面</h1>
        <p>页面内容</p>
      </div>
    </AdminLayout>
  );
}
```

## 布局结构 / Layout Structure

```tsx
<div className="min-h-screen bg-background">
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
</div>
```

### 布局说明 / Layout Description

1. 外层容器 / Outer container
   - 最小高度为视口高度 / Minimum height of viewport
   - 背景色使用主题变量 / Background color uses theme variable

2. 布局结构 / Layout structure
   - 使用 Flexbox 布局 / Uses Flexbox layout
   - 侧边栏固定宽度 / Sidebar has fixed width
   - 主内容区域自适应 / Main content area is adaptive

3. 内容区域 / Content area
   - 支持垂直滚动 / Supports vertical scrolling
   - 统一内边距 / Unified padding
   - 溢出处理 / Overflow handling

## 样式指南 / Styling Guidelines

组件使用 Tailwind CSS 类名，遵循以下顺序：
Component uses Tailwind CSS classes in the following order:

1. Layout (min-h-screen, flex, etc.)
2. Sizing (h-screen, flex-1, etc.)
3. Spacing (p-6, etc.)
4. Colors & Backgrounds (bg-background)
5. Overflow & Scrolling (overflow-hidden, overflow-y-auto)

## 最佳实践 / Best Practices

1. 保持布局结构清晰 / Keep layout structure clear
2. 确保响应式支持 / Ensure responsive support
3. 维护适当的组件层级 / Maintain proper component hierarchy
4. 优化性能和可访问性 / Optimize performance and accessibility 
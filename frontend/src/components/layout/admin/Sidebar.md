# Sidebar 组件 / Sidebar Component

## 描述 / Description

管理后台的侧边栏导航组件，提供可折叠的导航菜单和直观的用户界面。
Admin dashboard sidebar navigation component that provides a collapsible navigation menu and intuitive user interface.

### 功能特点 / Features

- 可折叠/展开切换 / Collapsible/Expandable toggle
- 响应式设计 / Responsive design
- 工具提示支持 / Tooltip support
- 活动项目高亮 / Active item highlighting
- 平滑过渡动画 / Smooth transition animations

## 属性 / Props

该组件目前不接受任何属性，使用内部状态管理。
This component currently doesn't accept any props, using internal state management.

## 依赖项 / Dependencies

```typescript
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  Settings,
  Newspaper,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
```

## 使用示例 / Usage Example

```tsx
import { Sidebar } from '@/components/layout/admin/Sidebar';

export function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main>{/* Content */}</main>
    </div>
  );
}
```

## 状态管理 / State Management

```typescript
const [isCollapsed, setIsCollapsed] = useState(false);
```

### 状态说明 / State Description

- `isCollapsed`: 控制侧边栏是否折叠 / Controls whether the sidebar is collapsed
- `setIsCollapsed`: 切换侧边栏状态的函数 / Function to toggle sidebar state

## 导航项配置 / Navigation Items Configuration

```typescript
const menuItems = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  // ... 其他导航项 / other navigation items
];
```

## 样式指南 / Styling Guidelines

组件使用 Tailwind CSS 类名，遵循以下顺序：
Component uses Tailwind CSS classes in the following order:

1. Layout & Position (flex, relative, etc.)
2. Sizing (w-64, h-screen, etc.)
3. Spacing (p-4, gap-3, etc.)
4. Typography (text-sm, font-medium, etc.)
5. Colors & Backgrounds
6. Borders & Shadows
7. Transitions & Animations
8. Interactive States (hover, active, etc.)

## 最佳实践 / Best Practices

1. 保持导航项结构统一 / Keep navigation item structure consistent
2. 使用语义化的图标 / Use semantic icons
3. 确保可访问性支持 / Ensure accessibility support
4. 维护响应式行为 / Maintain responsive behavior 
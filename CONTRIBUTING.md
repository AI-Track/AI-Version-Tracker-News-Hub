# AI News 项目贡献指南

## 项目架构规范

### 路由规范

本项目使用 Next.js Pages Router 模式进行开发。严格禁止使用 App Router。

#### 路由结构规范

- 所有页面必须放在 `frontend/src/pages` 目录下
- 动态路由使用 `[param]` 格式
- 布局组件统一使用 `frontend/src/components/layout` 中的组件

```
frontend/src/pages/
├── _app.tsx                 # 应用入口
├── index.tsx               # 首页
├── admin/                  # 管理后台
│   ├── articles/          # 文章管理
│   │   ├── index.tsx     # 文章列表
│   │   ├── [id]/        # 文章详情/编辑
│   │   │   └── edit.tsx
├── products/              # 产品页面
└── versions/              # 版本页面
```

### 组件规范

#### 组件目录结构

```
frontend/src/components/
├── admin/                  # 管理后台组件
├── common/                # 通用组件
├── layout/                # 布局组件
├── products/              # 产品相关组件
└── ui/                    # UI 基础组件
```

#### 组件开发规范

1. 使用函数式组件和 TypeScript
2. 使用 `next/router` 进行路由导航，不使用 `next/navigation`
3. 组件props必须定义类型接口
4. 遵循 React Hooks 的使用规范

```typescript
import { useRouter } from 'next/router';  // ✅ 正确
// import { useRouter } from 'next/navigation';  // ❌ 错误
```

### 状态管理

- 使用 React Hooks 管理局部状态
- 使用 Zustand 管理全局状态
- 避免使用 Context API 进行全局状态管理

### 样式规范

- 使用 Tailwind CSS 进行样式开发
- 使用 shadcn/ui 组件库
- 遵循项目预设的主题变量

### API 调用

- API 请求统一在 `src/services` 目录下管理
- 使用 axios 进行 HTTP 请求
- 所有 API 类型定义放在 `src/types` 目录下

### 文件命名规范

- 组件文件：PascalCase（如 `ArticleList.tsx`）
- 工具文件：camelCase（如 `formatDate.ts`）
- 类型定义文件：camelCase（如 `article.ts`）
- 样式文件：camelCase（如 `variables.css`）

### Git 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>
```

type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 开发流程

1. 从 main 分支创建新的功能分支
2. 遵循上述规范进行开发
3. 提交前进行代码格式化和 lint 检查
4. 提交 PR 并等待审核

## 项目启动

```bash
# 安装依赖
pnpm install

# 开发环境启动
pnpm dev

# 构建
pnpm build

# 生产环境启动
pnpm start
```

## 注意事项

1. 严格遵循 Pages Router 模式，不使用 App Router
2. 保持组件的单一职责
3. 确保代码的类型安全
4. 编写必要的注释和文档
5. 遵循项目既定的代码风格

## 技术栈

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Axios

## 帮助和支持

如有任何问题，请查看项目文档或在 Issues 中提出。 
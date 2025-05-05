# Cursor 项目规则说明

本目录包含了项目的自动化规则配置，用于指导代码生成和项目规范。

## 规则文件说明

### routing.json
- 路由规范配置
- Pages Router 模式规则
- 动态路由命名约定
- 导入语句规范

### components.json
- 组件目录结构
- 命名规范
- 实现偏好
- TypeScript 规范

### styles.json
- 样式框架配置
- className 编写规范
- 主题定制规则
- 响应式设计规范

## 使用方法

1. 代码生成时参考这些规则
2. 确保新建文件符合命名规范
3. 遵循目录结构要求
4. 使用推荐的技术栈和实践

## 规则更新

如需更新规则：
1. 修改相应的 JSON 文件
2. 更新 CONTRIBUTING.md 中的对应部分
3. 确保团队成员了解新规则

## 关键规范摘要

1. 路由规范
   - 使用 Pages Router
   - 目录式路由优先
   - 禁用 App Router

2. 组件规范
   - 函数式组件
   - TypeScript 类型定义
   - 文件命名采用 PascalCase

3. 样式规范
   - 使用 Tailwind CSS
   - 采用 shadcn/ui 组件
   - className 顺序要求

## 注意事项

- 这些规则会被 Cursor 用于代码生成和提示
- 规则文件采用 JSON 格式，便于解析
- 规则应与项目文档保持同步 
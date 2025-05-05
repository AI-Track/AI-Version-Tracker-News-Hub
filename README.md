# AI News Platform

AI 新闻和版本追踪平台，帮助用户实时了解 AI 领域的最新动态和版本更新。

## 项目特点

- 实时追踪 AI 产品更新
- 智能新闻聚合
- 版本变更对比
- 多语言支持
- 响应式设计

## 技术架构

- 前端：Next.js (Pages Router)
- 后端：Node.js + Express
- 数据库：MongoDB
- 爬虫：Python + Scrapy
- 部署：Docker + Docker Compose

## 快速开始

### 环境要求

- Node.js 18+
- PNPM 8+
- Docker & Docker Compose
- Python 3.8+

### 安装和运行

1. 克隆项目
```bash
git clone https://github.com/yourusername/AI-News.git
cd AI-News
```

2. 安装依赖
```bash
# 前端依赖
cd frontend
pnpm install

# 后端依赖
cd ../backend
npm install

# 爬虫依赖
cd ../crawler
pip install -r requirements.txt
```

3. 启动开发环境
```bash
# 启动所有服务
docker-compose up -d

# 启动前端开发服务器
cd frontend
pnpm dev
```

## 项目结构

```
AI-News/
├── frontend/              # 前端项目 (Next.js)
├── backend/              # 后端服务
├── crawler/              # 爬虫服务
├── docs/                 # 项目文档
└── docker-compose.yml    # 容器编排配置
```

## 开发规范

本项目使用 Next.js 的 Pages Router 模式进行开发，严格遵循以下规范：

1. 路由开发
   - 使用 Pages Router，禁止使用 App Router
   - 所有页面位于 `frontend/src/pages` 目录
   - 使用 `next/router` 进行导航

2. 详细规范
   - 查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解更多

## 文档

- [开发指南](./docs/development.md)
- [API 文档](./docs/api.md)
- [部署指南](./docs/deployment.md)

## 贡献指南

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

MIT License 
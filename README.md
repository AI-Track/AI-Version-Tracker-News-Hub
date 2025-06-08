# AI News Platform

AI 新闻和版本追踪平台，帮助用户实时了解 AI 领域的最新动态和版本更新。

## 项目特点

- 实时追踪 AI 产品更新
- 智能新闻聚合
- 版本变更对比
- 多语言支持
- 响应式设计

## 技术架构

- **前端**：Next.js 14 (Pages Router) + TypeScript + Tailwind CSS
- **后端**：Go + Gin + GORM + JWT认证
- **数据库**：MySQL (关系数据) + MongoDB (文档数据) + Redis (缓存)
- **爬虫**：Python + Scrapy + Celery
- **部署**：Docker + Docker Compose

## 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm
- Docker & Docker Compose
- Go 1.21+
- Python 3.8+ (爬虫服务)

### 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd AI-Version-Tracker-News-Hub
```

2. 启动数据库服务
```bash
# 启动 MySQL, MongoDB, Redis
docker-compose up -d mysql mongodb redis
```

3. 启动后端服务
```bash
cd backend
# 设置Go代理（中国用户）
go env -w GOPROXY=https://goproxy.cn,direct
go mod tidy
go run cmd/main.go
```

4. 初始化测试数据
```bash
# 在另一个终端执行
docker exec -i ai-version-tracker-news-hub-mysql-1 mysql -u root -ppassword ai_tracker < backend/init.sql
```

5. 启动前端服务
```bash
cd frontend
pnpm install  # 或 npm install
pnpm dev      # 或 npm run dev
```

### 访问地址
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:4000
- **健康检查**: http://localhost:4000/health

### 测试账号
| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | password | 管理员 |
| editor | password | 编辑者 |
| viewer | password | 查看者 |

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
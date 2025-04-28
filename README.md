# AI Version Tracker & News Hub

一个专注于追踪 AI 产品版本迭代和新闻聚合的平台。实时监控 OpenAI、GitHub Copilot、Cursor 等主流 AI 产品的更新动态，并提供相关新闻资讯。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 主要功能 (Key Features)

- 🔄 AI 产品版本迭代追踪
  - OpenAI GPT 系列更新
  - GitHub Copilot 版本变化
  - Cursor IDE 功能迭代
  - 其他主流 AI 产品更新

- 📰 AI 相关新闻聚合
  - 产品发布新闻
  - 技术突破报道
  - 行业动态追踪
  - 重要更新通知

- 🕷️ 自动化数据采集
  - 网页爬虫监控
  - RSS 订阅集成
  - 自动更新提醒

## 项目结构 (Project Structure)

```
.
├── frontend/          # Next.js 前端应用
├── backend/           # Node.js 后端服务
├── crawler/           # 爬虫和 RSS 解析服务
├── docs/             # 项目文档
└── docker-compose.yml # Docker 配置
```

## 技术栈 (Tech Stack)

- 前端 (Frontend): Next.js + TypeScript + TailwindCSS
- 后端 (Backend): Node.js + Express + TypeScript
- 数据库 (Database): MongoDB
- 容器化 (Container): Docker & Docker Compose

## 快速开始 (Getting Started)

1. 克隆仓库 (Clone the repository)
2. 安装依赖 (Install dependencies):
   ```bash
   # 安装前端依赖 (Install frontend dependencies)
   cd frontend && npm install

   # 安装后端依赖 (Install backend dependencies)
   cd backend && npm install

   # 安装爬虫依赖 (Install crawler dependencies)
   cd crawler && npm install
   ```

3. 启动开发环境 (Start development environment):
   ```bash
   docker-compose up
   ```

4. 访问应用 (Access the application):
   - 前端界面 (Frontend): http://localhost:3000
   - 后端 API (Backend API): http://localhost:4000

## 开发指南 (Development)

- 前端开发 (Frontend development): `cd frontend && npm run dev`
- 后端开发 (Backend development): `cd backend && npm run dev`
- 爬虫开发 (Crawler development): `cd crawler && npm run dev`

## 文档 (Documentation)

详细文档请查看 `docs/` 目录。
Detailed documentation can be found in the `docs/` directory.

## 贡献指南 (Contributing)

欢迎提交 Issue 和 Pull Request 来帮助改进项目。
Feel free to submit issues and pull requests to help improve the project.

## 许可证 (License)

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
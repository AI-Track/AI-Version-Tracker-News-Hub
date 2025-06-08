# 🚀 AI Version Tracker - 部署指南

## 📋 环境要求

### 系统要求
- **操作系统**: Windows 10/11, macOS, Ubuntu 18.04+
- **内存**: 最少 4GB RAM (推荐 8GB+)
- **磁盘**: 最少 10GB 可用空间

### 必需软件

#### 1. Docker & Docker Compose
```bash
# Windows
# 下载并安装 Docker Desktop: https://www.docker.com/products/docker-desktop

# macOS
brew install docker docker-compose

# Ubuntu
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```

#### 2. Go 语言环境 (v1.21+)
```bash
# Windows
# 下载并安装: https://golang.org/dl/

# macOS
brew install go

# Ubuntu
sudo apt install golang-go
```

#### 3. Node.js (v18+) - 前端开发需要
```bash
# Windows
# 下载并安装: https://nodejs.org/

# macOS
brew install node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🔧 快速启动

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd AI-Version-Tracker-News-Hub
```

### 2. 启动数据库服务
```bash
# 启动数据库容器
docker-compose up -d mongodb mysql redis

# 验证服务状态
docker-compose ps
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑配置文件 (可选)
# backend/.env 文件内容：
APP_NAME=AI Tracker Backend
APP_PORT=4000
APP_MODE=debug

MONGODB_URI=mongodb://localhost:27017
MYSQL_DSN=root:password@tcp(localhost:3306)/ai_tracker?charset=utf8mb4&parseTime=True&loc=Local
REDIS_URL=localhost:6379

JWT_SECRET=your-super-secret-key-change-in-production
```

### 4. 初始化数据库
```bash
# 连接MySQL并执行初始化脚本
docker exec -i ai-version-tracker-news-hub-mysql-1 mysql -uroot -ppassword < backend/init.sql
```

### 5. 启动后端服务
```bash
cd backend

# 下载依赖
go mod tidy

# 启动服务
go run cmd/main.go
```

### 6. 验证服务
```bash
# 健康检查
curl http://localhost:4000/health

# API文档
open http://localhost:4000/swagger/index.html
```

## 🧪 功能测试

### 1. 认证功能测试

#### 登录测试
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

**期望响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2024-01-02T12:00:00Z",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "is_active": true
    }
  }
}
```

#### 获取用户信息
```bash
# 使用登录获得的token
export TOKEN="your-jwt-token-here"

curl -X GET http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 2. 新闻功能测试

#### 获取文章列表
```bash
curl -X GET "http://localhost:4000/api/v1/news/articles?page=1&page_size=10"
```

#### 获取轮播文章
```bash
curl -X GET "http://localhost:4000/api/v1/news/featured?limit=5"
```

#### 创建文章 (需要认证)
```bash
curl -X POST http://localhost:4000/api/v1/news/articles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试文章标题",
    "content": "这是一篇测试文章的内容...",
    "excerpt": "文章摘要",
    "category": "AI",
    "tags": ["测试", "AI"],
    "status": "published",
    "is_featured": true,
    "priority": 1
  }'
```

### 3. 搜索功能测试

#### 搜索文章
```bash
curl -X GET "http://localhost:4000/api/v1/news/search?keyword=AI&page=1&page_size=10"
```

#### 按分类获取文章
```bash
curl -X GET "http://localhost:4000/api/v1/news/categories/AI/articles?limit=10"
```

## 📊 性能测试

### 1. 并发测试
```bash
# 安装wrk测试工具
# macOS: brew install wrk
# Ubuntu: sudo apt install wrk

# 测试健康检查接口
wrk -t12 -c400 -d30s http://localhost:4000/health

# 测试文章列表接口
wrk -t12 -c400 -d30s http://localhost:4000/api/v1/news/articles
```

### 2. 内存和CPU监控
```bash
# 监控Go进程
go tool pprof http://localhost:4000/debug/pprof/heap

# 查看系统资源
htop  # 或 top
```

## 🐛 故障排除

### 常见问题

#### 1. 数据库连接失败
**错误**: `Failed to connect to MongoDB/MySQL`
**解决方案**:
```bash
# 检查数据库服务状态
docker-compose ps

# 重启数据库服务
docker-compose restart mongodb mysql redis

# 查看日志
docker-compose logs mongodb
docker-compose logs mysql
```

#### 2. 端口占用
**错误**: `bind: address already in use`
**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :4000  # Linux/macOS
netstat -ano | findstr 4000  # Windows

# 修改配置文件中的端口
# backend/config/config.yaml -> app.port
```

#### 3. Go依赖问题
**错误**: `go: module not found`
**解决方案**:
```bash
cd backend
go clean -modcache
go mod download
go mod tidy
```

#### 4. Redis连接问题
**错误**: `dial tcp: connect: connection refused`
**解决方案**:
```bash
# 检查Redis状态
docker exec -it ai-version-tracker-news-hub-redis-1 redis-cli ping

# 应该返回 PONG
```

### 日志查看
```bash
# 后端服务日志
# 服务启动时会在控制台显示

# Docker容器日志
docker-compose logs -f backend
docker-compose logs -f mongodb
docker-compose logs -f mysql
docker-compose logs -f redis
```

## 📈 监控和调试

### 1. API性能监控
访问: `http://localhost:4000/debug/pprof/`

### 2. 数据库状态
```bash
# MongoDB
docker exec -it ai-version-tracker-news-hub-mongodb-1 mongo
> show dbs
> use ai_tracker
> show collections

# MySQL
docker exec -it ai-version-tracker-news-hub-mysql-1 mysql -uroot -ppassword
> USE ai_tracker;
> SHOW TABLES;
> SELECT COUNT(*) FROM users;

# Redis
docker exec -it ai-version-tracker-news-hub-redis-1 redis-cli
> INFO
> KEYS *
```

### 3. 缓存状态检查
```bash
# 查看Redis中的缓存键
docker exec -it ai-version-tracker-news-hub-redis-1 redis-cli KEYS "articles:*"
docker exec -it ai-version-tracker-news-hub-redis-1 redis-cli KEYS "session:*"
```

## 🔄 开发流程

### 1. 代码热重载 (开发模式)
```bash
# 安装air工具 (Go热重载)
go install github.com/cosmtrek/air@latest

# 在backend目录下运行
cd backend
air
```

### 2. 数据库迁移
```bash
# 新增迁移文件
# 在 backend/migrations/ 目录下添加SQL文件

# 执行迁移
docker exec -i ai-version-tracker-news-hub-mysql-1 mysql -uroot -ppassword ai_tracker < backend/migrations/xxx.sql
```

### 3. API文档更新
```bash
# 安装swag工具
go install github.com/swaggo/swag/cmd/swag@latest

# 生成API文档
cd backend
swag init -g cmd/main.go

# 访问文档
open http://localhost:4000/swagger/index.html
```

## 🚀 生产部署

### 1. 构建生产镜像
```bash
# 构建后端镜像
docker build -t ai-tracker-backend:latest ./backend

# 使用docker-compose部署
docker-compose -f docker-compose.prod.yml up -d
```

### 2. 环境变量配置
```bash
# 生产环境变量
APP_MODE=release
JWT_SECRET=your-production-secret-key
MONGODB_URI=mongodb://mongo-prod:27017
MYSQL_DSN=user:password@tcp(mysql-prod:3306)/ai_tracker
REDIS_URL=redis-prod:6379
```

### 3. 反向代理配置 (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;  # 前端服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## ✅ 验证清单

### 基础功能验证
- [ ] 健康检查接口正常响应
- [ ] 数据库连接成功
- [ ] Redis缓存工作正常
- [ ] JWT认证功能正常
- [ ] 用户登录/登出正常
- [ ] 文章CRUD操作正常
- [ ] 分页和搜索功能正常
- [ ] API文档可以访问

### 性能验证
- [ ] API响应时间 < 100ms
- [ ] 并发处理能力 > 100 QPS
- [ ] 内存使用 < 100MB
- [ ] 缓存命中率 > 80%

### 安全验证
- [ ] JWT Token验证正确
- [ ] 权限控制生效
- [ ] 密码正确加密
- [ ] CORS配置正确
- [ ] SQL注入防护
- [ ] XSS防护

### 数据验证
- [ ] 数据库表结构正确
- [ ] 测试数据插入成功
- [ ] 数据关系完整
- [ ] 索引配置正确

## 📚 相关文档

- [架构设计文档](./ARCHITECTURE.md)
- [API接口文档](http://localhost:4000/swagger/index.html)
- [进度更新文档](./PROGRESS_UPDATE.md)
- [架构亮点文档](./ARCHITECTURE_HIGHLIGHTS.md)

## 🆘 获取帮助

如果遇到问题，请：

1. 查看上述故障排除指南
2. 检查日志输出
3. 确认环境配置正确
4. 提交Issue并附上错误信息

---

**🎉 恭喜！如果所有测试都通过，说明后端核心功能已经正常工作！** 
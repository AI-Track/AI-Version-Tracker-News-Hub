-- 初始化数据库
CREATE DATABASE IF NOT EXISTS ai_tracker;
USE ai_tracker;

-- 插入测试用户（密码: password）
INSERT INTO users (username, email, password, role, is_active, created_at, updated_at)
VALUES 
('admin', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYYXw6J3A1lZe32', 'admin', true, NOW(), NOW()),
('editor', 'editor@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYYXw6J3A1lZe32', 'editor', true, NOW(), NOW()),
('viewer', 'viewer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYYXw6J3A1lZe32', 'viewer', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- 插入测试新闻源
INSERT INTO news_sources (name, url, type, status, crawl_interval, created_at, updated_at)
VALUES
('OpenAI Blog', 'https://openai.com/blog/', 'rss', 'active', 3600, NOW(), NOW()),
('Google AI Blog', 'https://ai.googleblog.com/', 'rss', 'active', 3600, NOW(), NOW()),
('Anthropic News', 'https://www.anthropic.com/news', 'api', 'active', 7200, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name; 
package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"ai-tracker-backend/internal/model"
	"ai-tracker-backend/internal/repository"

	"github.com/go-redis/redis/v8"
)

type NewsService struct {
	articleRepo *repository.ArticleRepository
	redisClient *redis.Client
}

func NewNewsService(articleRepo *repository.ArticleRepository, redisClient *redis.Client) *NewsService {
	return &NewsService{
		articleRepo: articleRepo,
		redisClient: redisClient,
	}
}

// GetArticles 获取文章列表（支持分页和过滤）
func (s *NewsService) GetArticles(filter model.ArticleFilter, pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	// 设置默认分页参数
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 20
	}
	if pagination.PageSize > 100 {
		pagination.PageSize = 100
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:list:%s:%d:%d", s.buildFilterKey(filter), pagination.Page, pagination.PageSize)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var cachedResult struct {
			Articles   []*model.Article           `json:"articles"`
			Pagination *model.PaginationResponse `json:"pagination"`
		}
		if json.Unmarshal([]byte(cachedData), &cachedResult) == nil {
			return cachedResult.Articles, cachedResult.Pagination, nil
		}
	}

	// 从数据库查询
	articles, total, err := s.articleRepo.List(ctx, filter, pagination)
	if err != nil {
		return nil, nil, fmt.Errorf("查询文章列表失败: %v", err)
	}

	// 构建分页响应
	totalPages := int(total) / pagination.PageSize
	if int(total)%pagination.PageSize > 0 {
		totalPages++
	}

	paginationResp := &model.PaginationResponse{
		Page:       pagination.Page,
		PageSize:   pagination.PageSize,
		Total:      int(total),
		TotalPages: totalPages,
	}

	// 缓存结果（5分钟）
	result := struct {
		Articles   []*model.Article           `json:"articles"`
		Pagination *model.PaginationResponse `json:"pagination"`
	}{
		Articles:   articles,
		Pagination: paginationResp,
	}

	if resultData, err := json.Marshal(result); err == nil {
		s.redisClient.Set(ctx, cacheKey, resultData, 5*time.Minute)
	}

	return articles, paginationResp, nil
}

// GetArticleByID 根据ID获取文章详情
func (s *NewsService) GetArticleByID(id string) (*model.Article, error) {
	// 构建缓存键
	cacheKey := fmt.Sprintf("article:detail:%s", id)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var article model.Article
		if json.Unmarshal([]byte(cachedData), &article) == nil {
			return &article, nil
		}
	}

	// 从数据库查询
	article, err := s.articleRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("查询文章详情失败: %v", err)
	}

	// 缓存结果（1小时）
	if articleData, err := json.Marshal(article); err == nil {
		s.redisClient.Set(ctx, cacheKey, articleData, time.Hour)
	}

	return article, nil
}

// GetFeaturedArticles 获取轮播文章
func (s *NewsService) GetFeaturedArticles(limit int) ([]*model.Article, error) {
	if limit <= 0 {
		limit = 5
	}
	if limit > 20 {
		limit = 20
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:featured:%d", limit)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var articles []*model.Article
		if json.Unmarshal([]byte(cachedData), &articles) == nil {
			return articles, nil
		}
	}

	// 从数据库查询
	articles, err := s.articleRepo.GetFeatured(ctx, limit)
	if err != nil {
		return nil, fmt.Errorf("查询轮播文章失败: %v", err)
	}

	// 缓存结果（10分钟）
	if articlesData, err := json.Marshal(articles); err == nil {
		s.redisClient.Set(ctx, cacheKey, articlesData, 10*time.Minute)
	}

	return articles, nil
}

// CreateArticle 创建文章
func (s *NewsService) CreateArticle(req model.ArticleRequest, authorID uint, authorName string) (*model.Article, error) {
	article := &model.Article{
		Title:       req.Title,
		Content:     req.Content,
		Excerpt:     req.Excerpt,
		CoverImage:  req.CoverImage,
		Category:    req.Category,
		Tags:        req.Tags,
		Status:      req.Status,
		IsFeatured:  req.IsFeatured,
		Priority:    req.Priority,
		ReadTime:    s.calculateReadTime(req.Content),
		ViewCount:   0,
		Author: model.Author{
			ID:   fmt.Sprintf("%d", authorID),
			Name: authorName,
		},
	}

	// 处理发布时间
	if req.PublishDate != "" {
		if publishDate, err := time.Parse("2006-01-02T15:04:05Z", req.PublishDate); err == nil {
			article.PublishDate = &publishDate
		}
	}

	// 如果是发布状态且没有设置发布时间，使用当前时间
	if article.Status == "published" && article.PublishDate == nil {
		now := time.Now()
		article.PublishDate = &now
	}

	// 生成摘要（如果没有提供）
	if article.Excerpt == "" {
		article.Excerpt = s.generateExcerpt(article.Content)
	}

	ctx := context.Background()
	err := s.articleRepo.Create(ctx, article)
	if err != nil {
		return nil, fmt.Errorf("创建文章失败: %v", err)
	}

	// 清除相关缓存
	s.clearArticleCache("")

	return article, nil
}

// UpdateArticle 更新文章
func (s *NewsService) UpdateArticle(id string, req model.ArticleRequest, editorID uint, editorName string) (*model.Article, error) {
	// 先获取现有文章
	existingArticle, err := s.articleRepo.GetByID(context.Background(), id)
	if err != nil {
		return nil, fmt.Errorf("文章不存在: %v", err)
	}

	// 更新字段
	existingArticle.Title = req.Title
	existingArticle.Content = req.Content
	existingArticle.Excerpt = req.Excerpt
	existingArticle.CoverImage = req.CoverImage
	existingArticle.Category = req.Category
	existingArticle.Tags = req.Tags
	existingArticle.Status = req.Status
	existingArticle.IsFeatured = req.IsFeatured
	existingArticle.Priority = req.Priority
	existingArticle.ReadTime = s.calculateReadTime(req.Content)

	// 处理发布时间
	if req.PublishDate != "" {
		if publishDate, err := time.Parse("2006-01-02T15:04:05Z", req.PublishDate); err == nil {
			existingArticle.PublishDate = &publishDate
		}
	}

	// 如果是发布状态且没有设置发布时间，使用当前时间
	if existingArticle.Status == "published" && existingArticle.PublishDate == nil {
		now := time.Now()
		existingArticle.PublishDate = &now
	}

	// 生成摘要（如果没有提供）
	if existingArticle.Excerpt == "" {
		existingArticle.Excerpt = s.generateExcerpt(existingArticle.Content)
	}

	ctx := context.Background()
	err = s.articleRepo.Update(ctx, id, existingArticle)
	if err != nil {
		return nil, fmt.Errorf("更新文章失败: %v", err)
	}

	// 清除相关缓存
	s.clearArticleCache(id)

	return existingArticle, nil
}

// DeleteArticle 删除文章
func (s *NewsService) DeleteArticle(id string) error {
	ctx := context.Background()
	err := s.articleRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("删除文章失败: %v", err)
	}

	// 清除相关缓存
	s.clearArticleCache(id)

	return nil
}

// GetArticlesByCategory 根据分类获取文章
func (s *NewsService) GetArticlesByCategory(category string, limit int) ([]*model.Article, error) {
	if limit <= 0 {
		limit = 10
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:category:%s:%d", category, limit)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var articles []*model.Article
		if json.Unmarshal([]byte(cachedData), &articles) == nil {
			return articles, nil
		}
	}

	// 从数据库查询
	articles, err := s.articleRepo.GetByCategory(ctx, category, limit)
	if err != nil {
		return nil, fmt.Errorf("查询分类文章失败: %v", err)
	}

	// 缓存结果（30分钟）
	if articlesData, err := json.Marshal(articles); err == nil {
		s.redisClient.Set(ctx, cacheKey, articlesData, 30*time.Minute)
	}

	return articles, nil
}

// SearchArticles 搜索文章
func (s *NewsService) SearchArticles(keyword string, pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	if keyword == "" {
		return nil, nil, fmt.Errorf("搜索关键词不能为空")
	}

	// 设置默认分页参数
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 20
	}

	ctx := context.Background()
	articles, total, err := s.articleRepo.Search(ctx, keyword, pagination)
	if err != nil {
		return nil, nil, fmt.Errorf("搜索文章失败: %v", err)
	}

	// 构建分页响应
	totalPages := int(total) / pagination.PageSize
	if int(total)%pagination.PageSize > 0 {
		totalPages++
	}

	paginationResp := &model.PaginationResponse{
		Page:       pagination.Page,
		PageSize:   pagination.PageSize,
		Total:      int(total),
		TotalPages: totalPages,
	}

	return articles, paginationResp, nil
}

// 工具函数

// calculateReadTime 计算阅读时间（基于字数，平均每分钟200字）
func (s *NewsService) calculateReadTime(content string) int {
	wordCount := len([]rune(content))
	readTime := wordCount / 200
	if readTime < 1 {
		readTime = 1
	}
	return readTime
}

// generateExcerpt 生成文章摘要
func (s *NewsService) generateExcerpt(content string) string {
	runes := []rune(content)
	if len(runes) <= 150 {
		return content
	}
	return string(runes[:150]) + "..."
}

// buildFilterKey 构建过滤器缓存键
func (s *NewsService) buildFilterKey(filter model.ArticleFilter) string {
	return fmt.Sprintf("%s_%s_%s_%s_%v_%s_%s_%s",
		filter.Status,
		filter.Category,
		fmt.Sprintf("%v", filter.Tags),
		filter.Author,
		filter.IsFeatured,
		filter.Keyword,
		filter.StartDate,
		filter.EndDate,
	)
}

// clearArticleCache 清除文章相关缓存
func (s *NewsService) clearArticleCache(articleID string) {
	ctx := context.Background()
	
	// 清除文章详情缓存
	if articleID != "" {
		s.redisClient.Del(ctx, fmt.Sprintf("article:detail:%s", articleID))
	}

	// 清除列表缓存（使用模式删除）
	keys, err := s.redisClient.Keys(ctx, "articles:list:*").Result()
	if err == nil && len(keys) > 0 {
		s.redisClient.Del(ctx, keys...)
	}

	// 清除轮播缓存
	keys, err = s.redisClient.Keys(ctx, "articles:featured:*").Result()
	if err == nil && len(keys) > 0 {
		s.redisClient.Del(ctx, keys...)
	}

	// 清除分类缓存
	keys, err = s.redisClient.Keys(ctx, "articles:category:*").Result()
	if err == nil && len(keys) > 0 {
		s.redisClient.Del(ctx, keys...)
	}

	// 清除最新、热门、趋势缓存
	s.redisClient.Del(ctx, "articles:latest:*", "articles:hot:*", "articles:trending:*")
}

// GetLatestArticles 获取最新文章（按发布时间排序）
func (s *NewsService) GetLatestArticles(pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	// 设置默认分页参数
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 20
	}
	if pagination.PageSize > 100 {
		pagination.PageSize = 100
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:latest:%d:%d", pagination.Page, pagination.PageSize)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var cachedResult struct {
			Articles   []*model.Article           `json:"articles"`
			Pagination *model.PaginationResponse `json:"pagination"`
		}
		if json.Unmarshal([]byte(cachedData), &cachedResult) == nil {
			return cachedResult.Articles, cachedResult.Pagination, nil
		}
	}

	// 从数据库获取
	filter := model.ArticleFilter{
		Status: "published",
	}
	
	articles, paginationResp, err := s.articleRepo.GetLatestArticles(ctx, filter, pagination)
	if err != nil {
		return nil, nil, fmt.Errorf("获取最新文章失败: %v", err)
	}

	// 缓存结果
	result := struct {
		Articles   []*model.Article           `json:"articles"`
		Pagination *model.PaginationResponse `json:"pagination"`
	}{
		Articles:   articles,
		Pagination: paginationResp,
	}

	if resultData, err := json.Marshal(result); err == nil {
		s.redisClient.Set(ctx, cacheKey, resultData, 5*time.Minute)
	}

	return articles, paginationResp, nil
}

// GetHotArticles 获取热门文章（按阅读量排序）
func (s *NewsService) GetHotArticles(pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	// 设置默认分页参数
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 20
	}
	if pagination.PageSize > 100 {
		pagination.PageSize = 100
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:hot:%d:%d", pagination.Page, pagination.PageSize)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var cachedResult struct {
			Articles   []*model.Article           `json:"articles"`
			Pagination *model.PaginationResponse `json:"pagination"`
		}
		if json.Unmarshal([]byte(cachedData), &cachedResult) == nil {
			return cachedResult.Articles, cachedResult.Pagination, nil
		}
	}

	// 从数据库获取
	filter := model.ArticleFilter{
		Status: "published",
	}
	
	articles, paginationResp, err := s.articleRepo.GetHotArticles(ctx, filter, pagination)
	if err != nil {
		return nil, nil, fmt.Errorf("获取热门文章失败: %v", err)
	}

	// 缓存结果
	result := struct {
		Articles   []*model.Article           `json:"articles"`
		Pagination *model.PaginationResponse `json:"pagination"`
	}{
		Articles:   articles,
		Pagination: paginationResp,
	}

	if resultData, err := json.Marshal(result); err == nil {
		s.redisClient.Set(ctx, cacheKey, resultData, 10*time.Minute)
	}

	return articles, paginationResp, nil
}

// GetTrendingArticles 获取趋势文章（按综合热度排序）
func (s *NewsService) GetTrendingArticles(pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	// 设置默认分页参数
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 20
	}
	if pagination.PageSize > 100 {
		pagination.PageSize = 100
	}

	// 构建缓存键
	cacheKey := fmt.Sprintf("articles:trending:%d:%d", pagination.Page, pagination.PageSize)

	// 尝试从缓存获取
	ctx := context.Background()
	cachedData, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var cachedResult struct {
			Articles   []*model.Article           `json:"articles"`
			Pagination *model.PaginationResponse `json:"pagination"`
		}
		if json.Unmarshal([]byte(cachedData), &cachedResult) == nil {
			return cachedResult.Articles, cachedResult.Pagination, nil
		}
	}

	// 从数据库获取
	filter := model.ArticleFilter{
		Status: "published",
	}
	
	articles, paginationResp, err := s.articleRepo.GetTrendingArticles(ctx, filter, pagination)
	if err != nil {
		return nil, nil, fmt.Errorf("获取趋势文章失败: %v", err)
	}

	// 缓存结果
	result := struct {
		Articles   []*model.Article           `json:"articles"`
		Pagination *model.PaginationResponse `json:"pagination"`
	}{
		Articles:   articles,
		Pagination: paginationResp,
	}

	if resultData, err := json.Marshal(result); err == nil {
		s.redisClient.Set(ctx, cacheKey, resultData, 15*time.Minute)
	}

	return articles, paginationResp, nil
} 
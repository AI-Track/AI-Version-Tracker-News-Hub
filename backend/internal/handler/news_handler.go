package handler

import (
	"net/http"
	"strconv"

	"ai-tracker-backend/internal/model"
	"ai-tracker-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type NewsHandler struct {
	newsService *service.NewsService
}

func NewNewsHandler(newsService *service.NewsService) *NewsHandler {
	return &NewsHandler{
		newsService: newsService,
	}
}

// GetArticles 获取文章列表
// @Summary 获取文章列表
// @Description 获取文章列表，支持分页和过滤
// @Tags 新闻
// @Accept json
// @Produce json
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(20)
// @Param status query string false "文章状态" Enums(published,draft,archived)
// @Param category query string false "文章分类"
// @Param keyword query string false "搜索关键词"
// @Param is_featured query bool false "是否精选"
// @Success 200 {object} map[string]interface{} "文章列表"
// @Router /news/articles [get]
func (h *NewsHandler) GetArticles(c *gin.Context) {
	// 解析分页参数
	var pagination model.PaginationRequest
	if err := c.ShouldBindQuery(&pagination); err != nil {
		pagination.Page = 1
		pagination.PageSize = 20
	}

	// 解析过滤参数
	var filter model.ArticleFilter
	c.ShouldBindQuery(&filter)

	// 获取文章列表
	articles, paginationResp, err := h.newsService.GetArticles(filter, pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取文章列表失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"message":    "获取文章列表成功",
		"data":       articles,
		"pagination": paginationResp,
	})
}

// GetArticleByID 获取文章详情
// @Summary 获取文章详情
// @Description 根据ID获取文章详细信息
// @Tags 新闻
// @Accept json
// @Produce json
// @Param id path string true "文章ID"
// @Success 200 {object} model.Article "文章详情"
// @Failure 404 {object} map[string]interface{} "文章不存在"
// @Router /news/articles/{id} [get]
func (h *NewsHandler) GetArticleByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "文章ID不能为空",
		})
		return
	}

	article, err := h.newsService.GetArticleByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "文章不存在",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取文章详情成功",
		"data":    article,
	})
}

// GetFeaturedArticles 获取轮播文章
// @Summary 获取轮播文章
// @Description 获取精选的轮播文章列表
// @Tags 新闻
// @Accept json
// @Produce json
// @Param limit query int false "文章数量" default(5)
// @Success 200 {object} map[string]interface{} "轮播文章"
// @Router /news/featured [get]
func (h *NewsHandler) GetFeaturedArticles(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 5
	}

	articles, err := h.newsService.GetFeaturedArticles(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取轮播文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取轮播文章成功",
		"data":    articles,
	})
}

// CreateArticle 创建文章
// @Summary 创建文章
// @Description 创建新文章（需要编辑权限）
// @Tags 新闻
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body model.ArticleRequest true "文章信息"
// @Success 201 {object} model.Article "创建成功"
// @Failure 400 {object} map[string]interface{} "请求参数错误"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Failure 403 {object} map[string]interface{} "权限不足"
// @Router /news/articles [post]
func (h *NewsHandler) CreateArticle(c *gin.Context) {
	var req model.ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
			"error":   err.Error(),
		})
		return
	}

	// 获取当前用户信息
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户名信息缺失",
		})
		return
	}

	article, err := h.newsService.CreateArticle(req, userID.(uint), username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "创建文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "创建文章成功",
		"data":    article,
	})
}

// UpdateArticle 更新文章
// @Summary 更新文章
// @Description 更新现有文章（需要编辑权限）
// @Tags 新闻
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "文章ID"
// @Param request body model.ArticleRequest true "文章信息"
// @Success 200 {object} model.Article "更新成功"
// @Failure 400 {object} map[string]interface{} "请求参数错误"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Failure 403 {object} map[string]interface{} "权限不足"
// @Failure 404 {object} map[string]interface{} "文章不存在"
// @Router /news/articles/{id} [put]
func (h *NewsHandler) UpdateArticle(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "文章ID不能为空",
		})
		return
	}

	var req model.ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
			"error":   err.Error(),
		})
		return
	}

	// 获取当前用户信息
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户名信息缺失",
		})
		return
	}

	article, err := h.newsService.UpdateArticle(id, req, userID.(uint), username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "更新文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "更新文章成功",
		"data":    article,
	})
}

// DeleteArticle 删除文章
// @Summary 删除文章
// @Description 删除指定文章（需要管理员权限）
// @Tags 新闻
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "文章ID"
// @Success 200 {object} map[string]interface{} "删除成功"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Failure 403 {object} map[string]interface{} "权限不足"
// @Failure 404 {object} map[string]interface{} "文章不存在"
// @Router /news/articles/{id} [delete]
func (h *NewsHandler) DeleteArticle(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "文章ID不能为空",
		})
		return
	}

	err := h.newsService.DeleteArticle(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "删除文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "删除文章成功",
	})
}

// GetArticlesByCategory 根据分类获取文章
// @Summary 根据分类获取文章
// @Description 获取指定分类的文章列表
// @Tags 新闻
// @Accept json
// @Produce json
// @Param category path string true "文章分类"
// @Param limit query int false "文章数量" default(10)
// @Success 200 {object} map[string]interface{} "分类文章"
// @Router /news/categories/{category}/articles [get]
func (h *NewsHandler) GetArticlesByCategory(c *gin.Context) {
	category := c.Param("category")
	if category == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "分类不能为空",
		})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}

	articles, err := h.newsService.GetArticlesByCategory(category, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取分类文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取分类文章成功",
		"data":    articles,
	})
}

// SearchArticles 搜索文章
// @Summary 搜索文章
// @Description 根据关键词搜索文章
// @Tags 新闻
// @Accept json
// @Produce json
// @Param keyword query string true "搜索关键词"
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(20)
// @Success 200 {object} map[string]interface{} "搜索结果"
// @Router /news/search [get]
func (h *NewsHandler) SearchArticles(c *gin.Context) {
	keyword := c.Query("keyword")
	if keyword == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "搜索关键词不能为空",
		})
		return
	}

	// 解析分页参数
	var pagination model.PaginationRequest
	if err := c.ShouldBindQuery(&pagination); err != nil {
		pagination.Page = 1
		pagination.PageSize = 20
	}

	articles, paginationResp, err := h.newsService.SearchArticles(keyword, pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "搜索文章失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"message":    "搜索文章成功",
		"data":       articles,
		"pagination": paginationResp,
		"keyword":    keyword,
	})
} 
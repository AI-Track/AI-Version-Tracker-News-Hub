package handler

import (
	"net/http"

	"ai-tracker-backend/internal/model"
	"ai-tracker-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Login 用户登录
// @Summary 用户登录
// @Description 用户登录接口
// @Tags 认证
// @Accept json
// @Produce json
// @Param request body model.LoginRequest true "登录请求"
// @Success 200 {object} model.LoginResponse "登录成功"
// @Failure 400 {object} map[string]interface{} "请求参数错误"
// @Failure 401 {object} map[string]interface{} "认证失败"
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
			"error":   err.Error(),
		})
		return
	}

	// 调用登录服务
	response, err := h.authService.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "登录成功",
		"data":    response,
	})
}

// Logout 用户登出
// @Summary 用户登出
// @Description 用户登出接口
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{} "登出成功"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	err := h.authService.Logout(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "登出失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "登出成功",
	})
}

// RefreshToken 刷新Token
// @Summary 刷新访问令牌
// @Description 使用刷新令牌获取新的访问令牌
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} model.LoginResponse "刷新成功"
// @Failure 401 {object} map[string]interface{} "刷新失败"
// @Router /auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	// 从Header获取刷新Token
	refreshToken := c.GetHeader("X-Refresh-Token")
	if refreshToken == "" {
		// 如果Header中没有，尝试从认证Header中获取
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			refreshToken = authHeader[7:] // 移除 "Bearer " 前缀
		}
	}

	if refreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "缺少刷新令牌",
		})
		return
	}

	response, err := h.authService.RefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "令牌刷新成功",
		"data":    response,
	})
}

// GetProfile 获取用户信息
// @Summary 获取当前用户信息
// @Description 获取当前登录用户的详细信息
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} model.User "用户信息"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Router /auth/profile [get]
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	user, err := h.authService.GetProfile(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取用户信息失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取用户信息成功",
		"data":    user,
	})
}

// ExtendSession 延长会话
// @Summary 延长用户会话
// @Description 延长当前用户的会话时间
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{} "会话延长成功"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Router /auth/extend [post]
func (h *AuthHandler) ExtendSession(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	err := h.authService.ExtendSession(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "延长会话失败",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "会话延长成功",
	})
}

// GetSessionInfo 获取会话信息
// @Summary 获取用户会话信息
// @Description 获取当前用户的会话详细信息
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{} "会话信息"
// @Failure 401 {object} map[string]interface{} "未认证"
// @Router /auth/session [get]
func (h *AuthHandler) GetSessionInfo(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户信息缺失",
		})
		return
	}

	sessionInfo, err := h.authService.GetUserSessions(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取会话信息失败",
			"error":   err.Error(),
		})
		return
	}

	// 移除敏感信息
	delete(sessionInfo, "token")
	delete(sessionInfo, "refresh_token")

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取会话信息成功",
		"data":    sessionInfo,
	})
} 
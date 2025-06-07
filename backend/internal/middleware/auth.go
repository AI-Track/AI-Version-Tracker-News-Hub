package middleware

import (
	"net/http"
	"strings"

	"ai-tracker-backend/internal/service"

	"github.com/gin-gonic/gin"
)

// JWTAuth JWT认证中间件
func JWTAuth(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取Authorization头
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Missing authorization header",
				"code":    "UNAUTHORIZED",
			})
			c.Abort()
			return
		}

		// 检查Bearer前缀
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid authorization header format",
				"code":    "INVALID_TOKEN_FORMAT",
			})
			c.Abort()
			return
		}

		// 提取Token
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Empty token",
				"code":    "EMPTY_TOKEN",
			})
			c.Abort()
			return
		}

		// 验证Token
		userID, username, role, err := authService.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token",
				"code":    "INVALID_TOKEN",
				"error":   err.Error(),
			})
			c.Abort()
			return
		}

		// 检查会话是否有效
		if !authService.IsSessionValid(userID) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Session expired",
				"code":    "SESSION_EXPIRED",
			})
			c.Abort()
			return
		}

		// 将用户信息存储到上下文
		c.Set("user_id", userID)
		c.Set("username", username)
		c.Set("role", role)

		c.Next()
	}
}

// RequireRole 角色权限验证中间件
func RequireRole(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Role information missing",
				"code":    "ROLE_MISSING",
			})
			c.Abort()
			return
		}

		userRole := role.(string)

		// 权限层级: admin > editor > viewer
		if !hasPermission(userRole, requiredRole) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Insufficient permissions",
				"code":    "INSUFFICIENT_PERMISSIONS",
				"required_role": requiredRole,
				"user_role": userRole,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// hasPermission 检查用户角色是否有足够权限
func hasPermission(userRole, requiredRole string) bool {
	roleLevel := map[string]int{
		"viewer": 1,
		"editor": 2,
		"admin":  3,
	}

	userLevel, userExists := roleLevel[userRole]
	requiredLevel, requiredExists := roleLevel[requiredRole]

	if !userExists || !requiredExists {
		return false
	}

	return userLevel >= requiredLevel
}

// RequirePermission 特定权限验证中间件
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Role information missing",
				"code":    "ROLE_MISSING",
			})
			c.Abort()
			return
		}

		userRole := role.(string)

		if !hasSpecificPermission(userRole, permission) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Insufficient permissions",
				"code":    "INSUFFICIENT_PERMISSIONS",
				"required_permission": permission,
				"user_role": userRole,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// hasSpecificPermission 检查特定权限
func hasSpecificPermission(userRole, permission string) bool {
	permissions := map[string][]string{
		"viewer": {"read"},
		"editor": {"read", "write", "publish"},
		"admin":  {"read", "write", "publish", "delete", "manage_users", "manage_sources"},
	}

	rolePermissions, exists := permissions[userRole]
	if !exists {
		return false
	}

	for _, p := range rolePermissions {
		if p == permission {
			return true
		}
	}

	return false
} 
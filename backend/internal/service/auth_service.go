package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"ai-tracker-backend/internal/model"
	"ai-tracker-backend/internal/repository"
	"ai-tracker-backend/internal/util"

	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type AuthService struct {
	userRepo      *repository.UserRepository
	redisClient   *redis.Client
	jwtSecret     string
	tokenExpiry   int
	refreshExpiry int
}

func NewAuthService(userRepo *repository.UserRepository, redisClient *redis.Client, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:      userRepo,
		redisClient:   redisClient,
		jwtSecret:     jwtSecret,
		tokenExpiry:   86400,  // 24小时
		refreshExpiry: 604800, // 7天
	}
}

// Login 用户登录
func (s *AuthService) Login(req model.LoginRequest) (*model.LoginResponse, error) {
	// 查找用户
	user, err := s.userRepo.GetByUsername(req.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("用户名或密码错误")
		}
		return nil, fmt.Errorf("查询用户失败: %v", err)
	}

	// 检查用户状态
	if !user.IsActive {
		return nil, errors.New("账户已被禁用")
	}

	// 验证密码
	if !util.CheckPassword(user.Password, req.Password) {
		return nil, errors.New("用户名或密码错误")
	}

	// 生成Token
	token, err := util.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.tokenExpiry)
	if err != nil {
		return nil, fmt.Errorf("生成Token失败: %v", err)
	}

	// 生成刷新Token
	refreshToken, err := util.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.refreshExpiry)
	if err != nil {
		return nil, fmt.Errorf("生成刷新Token失败: %v", err)
	}

	// 存储会话到Redis
	sessionKey := fmt.Sprintf("session:%d", user.ID)
	sessionData := map[string]interface{}{
		"user_id":       user.ID,
		"username":      user.Username,
		"role":          user.Role,
		"login_time":    time.Now().Unix(),
		"token":         token,
		"refresh_token": refreshToken,
	}

	ctx := context.Background()
	err = s.redisClient.HMSet(ctx, sessionKey, sessionData).Err()
	if err != nil {
		return nil, fmt.Errorf("存储会话失败: %v", err)
	}

	// 设置会话过期时间
	s.redisClient.Expire(ctx, sessionKey, time.Duration(s.tokenExpiry)*time.Second)

	// 更新最后登录时间
	s.userRepo.UpdateLastLogin(user.ID)

	// 清除密码字段
	user.Password = ""

	return &model.LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresAt:    time.Now().Add(time.Duration(s.tokenExpiry) * time.Second),
		User:         user,
	}, nil
}

// Logout 用户登出
func (s *AuthService) Logout(userID uint) error {
	sessionKey := fmt.Sprintf("session:%d", userID)
	ctx := context.Background()

	err := s.redisClient.Del(ctx, sessionKey).Err()
	if err != nil {
		return fmt.Errorf("删除会话失败: %v", err)
	}

	return nil
}

// ValidateToken 验证Token
func (s *AuthService) ValidateToken(tokenString string) (uint, string, string, error) {
	claims, err := util.ValidateToken(tokenString, s.jwtSecret)
	if err != nil {
		return 0, "", "", err
	}

	return claims.UserID, claims.Username, claims.Role, nil
}

// RefreshToken 刷新Token
func (s *AuthService) RefreshToken(refreshTokenString string) (*model.LoginResponse, error) {
	// 验证刷新Token
	claims, err := util.ValidateToken(refreshTokenString, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("无效的刷新Token: %v", err)
	}

	// 检查会话是否存在
	sessionKey := fmt.Sprintf("session:%d", claims.UserID)
	ctx := context.Background()

	exists, err := s.redisClient.Exists(ctx, sessionKey).Result()
	if err != nil || exists == 0 {
		return nil, errors.New("会话不存在或已过期")
	}

	// 获取用户信息
	user, err := s.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("获取用户信息失败: %v", err)
	}

	if !user.IsActive {
		return nil, errors.New("账户已被禁用")
	}

	// 生成新Token
	newToken, err := util.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.tokenExpiry)
	if err != nil {
		return nil, fmt.Errorf("生成新Token失败: %v", err)
	}

	// 生成新的刷新Token
	newRefreshToken, err := util.GenerateToken(user.ID, user.Username, user.Role, s.jwtSecret, s.refreshExpiry)
	if err != nil {
		return nil, fmt.Errorf("生成新刷新Token失败: %v", err)
	}

	// 更新会话
	sessionData := map[string]interface{}{
		"token":         newToken,
		"refresh_token": newRefreshToken,
		"refresh_time":  time.Now().Unix(),
	}

	err = s.redisClient.HMSet(ctx, sessionKey, sessionData).Err()
	if err != nil {
		return nil, fmt.Errorf("更新会话失败: %v", err)
	}

	// 延长会话过期时间
	s.redisClient.Expire(ctx, sessionKey, time.Duration(s.tokenExpiry)*time.Second)

	// 清除密码字段
	user.Password = ""

	return &model.LoginResponse{
		Token:        newToken,
		RefreshToken: newRefreshToken,
		ExpiresAt:    time.Now().Add(time.Duration(s.tokenExpiry) * time.Second),
		User:         user,
	}, nil
}

// GetProfile 获取用户信息
func (s *AuthService) GetProfile(userID uint) (*model.User, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("获取用户信息失败: %v", err)
	}

	// 清除密码字段
	user.Password = ""
	return user, nil
}

// IsSessionValid 检查会话是否有效
func (s *AuthService) IsSessionValid(userID uint) bool {
	sessionKey := fmt.Sprintf("session:%d", userID)
	ctx := context.Background()

	exists, err := s.redisClient.Exists(ctx, sessionKey).Result()
	return err == nil && exists > 0
}

// ExtendSession 延长会话
func (s *AuthService) ExtendSession(userID uint) error {
	sessionKey := fmt.Sprintf("session:%d", userID)
	ctx := context.Background()

	// 检查会话是否存在
	exists, err := s.redisClient.Exists(ctx, sessionKey).Result()
	if err != nil || exists == 0 {
		return errors.New("会话不存在")
	}

	// 延长过期时间
	err = s.redisClient.Expire(ctx, sessionKey, time.Duration(s.tokenExpiry)*time.Second).Err()
	if err != nil {
		return fmt.Errorf("延长会话失败: %v", err)
	}

	return nil
}

// GetActiveSessionsCount 获取活跃会话数量
func (s *AuthService) GetActiveSessionsCount() (int, error) {
	ctx := context.Background()
	pattern := "session:*"

	keys, err := s.redisClient.Keys(ctx, pattern).Result()
	if err != nil {
		return 0, fmt.Errorf("获取会话列表失败: %v", err)
	}

	return len(keys), nil
}

// ClearExpiredSessions 清理过期会话（定时任务使用）
func (s *AuthService) ClearExpiredSessions() error {
	ctx := context.Background()
	pattern := "session:*"

	keys, err := s.redisClient.Keys(ctx, pattern).Result()
	if err != nil {
		return fmt.Errorf("获取会话列表失败: %v", err)
	}

	var expiredKeys []string
	for _, key := range keys {
		ttl, err := s.redisClient.TTL(ctx, key).Result()
		if err != nil || ttl <= 0 {
			expiredKeys = append(expiredKeys, key)
		}
	}

	if len(expiredKeys) > 0 {
		err = s.redisClient.Del(ctx, expiredKeys...).Err()
		if err != nil {
			return fmt.Errorf("清理过期会话失败: %v", err)
		}
	}

	return nil
}

// GetUserSessions 获取用户的会话信息
func (s *AuthService) GetUserSessions(userID uint) (map[string]interface{}, error) {
	sessionKey := fmt.Sprintf("session:%d", userID)
	ctx := context.Background()

	data, err := s.redisClient.HGetAll(ctx, sessionKey).Result()
	if err != nil {
		return nil, fmt.Errorf("获取会话信息失败: %v", err)
	}

	if len(data) == 0 {
		return nil, errors.New("会话不存在")
	}

	// 转换数据类型
	result := make(map[string]interface{})
	for k, v := range data {
		if k == "user_id" || k == "login_time" || k == "refresh_time" {
			if intVal, err := strconv.ParseInt(v, 10, 64); err == nil {
				result[k] = intVal
			} else {
				result[k] = v
			}
		} else {
			result[k] = v
		}
	}

	return result, nil
} 
package main

import (
	"ai-tracker-backend/internal/config"
	"ai-tracker-backend/internal/database"
	"ai-tracker-backend/internal/handler"
	"ai-tracker-backend/internal/middleware"
	"ai-tracker-backend/internal/model"
	"ai-tracker-backend/internal/repository"
	"ai-tracker-backend/internal/service"
	"log"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title AI Tracker API
// @version 1.0
// @description AI产品追踪平台后端API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:4000
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库连接
	mongoDB := database.InitMongoDB(cfg.MongoDB.URI)
	mysqlDB := database.InitMySQL(cfg.MySQL.DSN)
	redisClient := database.InitRedis(cfg.Redis.Addr, cfg.Redis.Password, cfg.Redis.DB)

	// 数据库迁移 - 创建表结构
	err := mysqlDB.AutoMigrate(&model.User{}, &model.NewsSource{})
	if err != nil {
		log.Fatal("Database migration failed:", err)
	}

	// 初始化仓储层
	userRepo := repository.NewUserRepository(mysqlDB)
	articleRepo := repository.NewArticleRepository(mongoDB)

	// 初始化服务层
	authService := service.NewAuthService(userRepo, redisClient, cfg.JWT.Secret)
	newsService := service.NewNewsService(articleRepo, redisClient)

	// 初始化处理器层
	authHandler := handler.NewAuthHandler(authService)
	newsHandler := handler.NewNewsHandler(newsService)

	// 设置 Gin 模式
	if cfg.App.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy", 
			"service": "ai-tracker-backend",
			"version": "1.0.0",
		})
	})

	// API 路由组
	api := router.Group("/api/v1")

	// 认证路由
	auth := api.Group("/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/logout", middleware.JWTAuth(authService), authHandler.Logout)
		auth.POST("/refresh", authHandler.RefreshToken)
		auth.GET("/profile", middleware.JWTAuth(authService), authHandler.GetProfile)
		auth.POST("/extend", middleware.JWTAuth(authService), authHandler.ExtendSession)
		auth.GET("/session", middleware.JWTAuth(authService), authHandler.GetSessionInfo)
	}

	// 新闻路由
	news := api.Group("/news")
	{
		// 公开路由
		news.GET("/articles", newsHandler.GetArticles)
		news.GET("/articles/:id", newsHandler.GetArticleByID)
		news.GET("/featured", newsHandler.GetFeaturedArticles)
		news.GET("/latest", newsHandler.GetLatestArticles)
		news.GET("/hot", newsHandler.GetHotArticles)
		news.GET("/trending", newsHandler.GetTrendingArticles)
		news.GET("/search", newsHandler.SearchArticles)
		news.GET("/categories/:category/articles", newsHandler.GetArticlesByCategory)
		
		// 需要认证的路由
		protected := news.Group("", middleware.JWTAuth(authService))
		{
			protected.POST("/articles", middleware.RequireRole("editor"), newsHandler.CreateArticle)
			protected.PUT("/articles/:id", middleware.RequireRole("editor"), newsHandler.UpdateArticle)
			protected.DELETE("/articles/:id", middleware.RequireRole("admin"), newsHandler.DeleteArticle)
		}
	}

	// Swagger 文档
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 启动服务器
	log.Printf("🚀 Server starting on port %s", cfg.App.Port)
	log.Printf("📚 API Documentation: http://localhost:%s/swagger/index.html", cfg.App.Port)
	log.Printf("❤️  Health Check: http://localhost:%s/health", cfg.App.Port)
	
	if err := router.Run(":" + cfg.App.Port); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
} 
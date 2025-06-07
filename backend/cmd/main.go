package main

import (
	"ai-tracker-backend/internal/config"
	"ai-tracker-backend/internal/database"
	"ai-tracker-backend/internal/handler"
	"ai-tracker-backend/internal/middleware"
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

	// 初始化仓储层
	userRepo := repository.NewUserRepository(mysqlDB)
	articleRepo := repository.NewArticleRepository(mongoDB)
	productRepo := repository.NewProductRepository(mongoDB)
	newsSourceRepo := repository.NewNewsSourceRepository(mysqlDB)

	// 初始化服务层
	authService := service.NewAuthService(userRepo, redisClient, cfg.JWT.Secret)
	newsService := service.NewNewsService(articleRepo, redisClient)
	productService := service.NewProductService(productRepo, redisClient)
	adminService := service.NewAdminService(newsSourceRepo, userRepo)

	// 初始化处理器层
	authHandler := handler.NewAuthHandler(authService)
	newsHandler := handler.NewNewsHandler(newsService)
	productHandler := handler.NewProductHandler(productService)
	adminHandler := handler.NewAdminHandler(adminService)

	// 设置 Gin 路由
	if cfg.App.Mode == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())

	// API 路由组
	v1 := router.Group("/api/v1")

	// 认证路由
	authGroup := v1.Group("/auth")
	{
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/logout", middleware.JWTAuth(authService), authHandler.Logout)
		authGroup.POST("/refresh", middleware.JWTAuth(authService), authHandler.RefreshToken)
		authGroup.GET("/profile", middleware.JWTAuth(authService), authHandler.GetProfile)
	}

	// 新闻路由
	newsGroup := v1.Group("/news")
	{
		newsGroup.GET("/articles", newsHandler.GetArticles)
		newsGroup.GET("/articles/:id", newsHandler.GetArticleByID)
		newsGroup.GET("/featured", newsHandler.GetFeaturedArticles)
		
		// 需要认证的路由
		newsGroup.Use(middleware.JWTAuth(authService))
		newsGroup.POST("/articles", middleware.RequireRole("editor"), newsHandler.CreateArticle)
		newsGroup.PUT("/articles/:id", middleware.RequireRole("editor"), newsHandler.UpdateArticle)
		newsGroup.DELETE("/articles/:id", middleware.RequireRole("admin"), newsHandler.DeleteArticle)
	}

	// 产品路由
	productGroup := v1.Group("/products")
	{
		productGroup.GET("", productHandler.GetProducts)
		productGroup.GET("/:id", productHandler.GetProductByID)
		productGroup.GET("/:id/versions", productHandler.GetProductVersions)
		
		// 需要认证的路由
		productGroup.Use(middleware.JWTAuth(authService))
		productGroup.POST("", middleware.RequireRole("editor"), productHandler.CreateProduct)
		productGroup.PUT("/:id", middleware.RequireRole("editor"), productHandler.UpdateProduct)
		productGroup.DELETE("/:id", middleware.RequireRole("admin"), productHandler.DeleteProduct)
	}

	// 管理员路由
	adminGroup := v1.Group("/admin")
	adminGroup.Use(middleware.JWTAuth(authService))
	adminGroup.Use(middleware.RequireRole("editor"))
	{
		adminGroup.GET("/news-sources", adminHandler.GetNewsSources)
		adminGroup.POST("/news-sources", adminHandler.CreateNewsSource)
		adminGroup.PUT("/news-sources/:id", adminHandler.UpdateNewsSource)
		adminGroup.DELETE("/news-sources/:id", middleware.RequireRole("admin"), adminHandler.DeleteNewsSource)
		adminGroup.POST("/crawl/trigger", adminHandler.TriggerCrawl)
	}

	// Swagger 文档
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy", "service": "ai-tracker-backend"})
	})

	// 启动服务器
	log.Printf("Server starting on port %s", cfg.App.Port)
	if err := router.Run(":" + cfg.App.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 
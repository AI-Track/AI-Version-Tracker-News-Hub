package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	App     AppConfig     `mapstructure:"app"`
	MongoDB MongoDBConfig `mapstructure:"mongodb"`
	MySQL   MySQLConfig   `mapstructure:"mysql"`
	Redis   RedisConfig   `mapstructure:"redis"`
	JWT     JWTConfig     `mapstructure:"jwt"`
}

type AppConfig struct {
	Name string `mapstructure:"name"`
	Port string `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type MongoDBConfig struct {
	URI      string `mapstructure:"uri"`
	Database string `mapstructure:"database"`
}

type MySQLConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Database string `mapstructure:"database"`
	DSN      string `mapstructure:"dsn"`
}

type RedisConfig struct {
	Addr     string `mapstructure:"addr"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type JWTConfig struct {
	Secret         string `mapstructure:"secret"`
	ExpirationTime int    `mapstructure:"expiration_time"`
}

func Load() *Config {
	// 加载 .env 文件
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")
	viper.AddConfigPath(".")

	// 设置环境变量前缀
	viper.SetEnvPrefix("AI_TRACKER")
	viper.AutomaticEnv()

	// 设置默认值
	setDefaults()

	// 从环境变量覆盖配置
	overrideWithEnv()

	var config Config
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Config file not found, using defaults and environment variables: %v", err)
	}

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatalf("Unable to decode config: %v", err)
	}

	// 构建 MySQL DSN
	if config.MySQL.DSN == "" {
		config.MySQL.DSN = buildMySQLDSN(config.MySQL)
	}

	return &config
}

func setDefaults() {
	// 应用配置默认值
	viper.SetDefault("app.name", "ai-tracker-backend")
	viper.SetDefault("app.port", "4000")
	viper.SetDefault("app.mode", "development")

	// MongoDB 配置默认值
	viper.SetDefault("mongodb.uri", "mongodb://localhost:27017")
	viper.SetDefault("mongodb.database", "ai_tracker")

	// MySQL 配置默认值
	viper.SetDefault("mysql.host", "localhost")
	viper.SetDefault("mysql.port", "3306")
	viper.SetDefault("mysql.user", "root")
	viper.SetDefault("mysql.password", "")
	viper.SetDefault("mysql.database", "ai_tracker")

	// Redis 配置默认值
	viper.SetDefault("redis.addr", "localhost:6379")
	viper.SetDefault("redis.password", "")
	viper.SetDefault("redis.db", 0)

	// JWT 配置默认值
	viper.SetDefault("jwt.secret", "your-secret-key")
	viper.SetDefault("jwt.expiration_time", 86400) // 24小时
}

func overrideWithEnv() {
	// 应用配置
	if port := os.Getenv("PORT"); port != "" {
		viper.Set("app.port", port)
	}
	if mode := os.Getenv("GIN_MODE"); mode != "" {
		viper.Set("app.mode", mode)
	}

	// 数据库配置
	if mongoURI := os.Getenv("MONGODB_URI"); mongoURI != "" {
		viper.Set("mongodb.uri", mongoURI)
	}
	if mysqlDSN := os.Getenv("MYSQL_DSN"); mysqlDSN != "" {
		viper.Set("mysql.dsn", mysqlDSN)
	}
	if redisURL := os.Getenv("REDIS_URL"); redisURL != "" {
		viper.Set("redis.addr", redisURL)
	}

	// JWT 配置
	if jwtSecret := os.Getenv("JWT_SECRET"); jwtSecret != "" {
		viper.Set("jwt.secret", jwtSecret)
	}
}

func buildMySQLDSN(cfg MySQLConfig) string {
	return cfg.User + ":" + cfg.Password + "@tcp(" + cfg.Host + ":" + cfg.Port + ")/" + cfg.Database + "?charset=utf8mb4&parseTime=True&loc=Local"
} 
package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	Username  string         `json:"username" gorm:"uniqueIndex;size:50;not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;size:100;not null"`
	Password  string         `json:"-" gorm:"size:255;not null"`
	Role      string         `json:"role" gorm:"type:enum('admin','editor','viewer');default:'viewer'"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}

// NewsSource 新闻源模型
type NewsSource struct {
	ID           uint           `json:"id" gorm:"primarykey"`
	Name         string         `json:"name" gorm:"size:100;not null"`
	URL          string         `json:"url" gorm:"size:500;not null"`
	Type         string         `json:"type" gorm:"type:enum('rss','api','web');not null"`
	Status       string         `json:"status" gorm:"type:enum('active','inactive','error');default:'active'"`
	CrawlInterval int           `json:"crawl_interval" gorm:"default:3600"`
	LastCrawlAt  *time.Time     `json:"last_crawl_at"`
	NextCrawlAt  *time.Time     `json:"next_crawl_at"`
	CrawlConfig  string         `json:"crawl_config" gorm:"type:json"`
	CreatedBy    uint           `json:"created_by"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联
	Creator *User `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
}

// TableName 指定表名
func (NewsSource) TableName() string {
	return "news_sources"
}

// SystemConfig 系统配置模型
type SystemConfig struct {
	ID          uint      `json:"id" gorm:"primarykey"`
	ConfigKey   string    `json:"config_key" gorm:"uniqueIndex;size:100;not null"`
	ConfigValue string    `json:"config_value" gorm:"type:json;not null"`
	Description string    `json:"description" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// TableName 指定表名
func (SystemConfig) TableName() string {
	return "system_configs"
}

 
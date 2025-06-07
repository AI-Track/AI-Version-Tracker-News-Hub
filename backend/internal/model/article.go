package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Article 文章模型
type Article struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title        string             `json:"title" bson:"title"`
	Content      string             `json:"content" bson:"content"`
	Excerpt      string             `json:"excerpt" bson:"excerpt"`
	CoverImage   string             `json:"cover_image" bson:"cover_image"`
	Author       Author             `json:"author" bson:"author"`
	Category     string             `json:"category" bson:"category"`
	Tags         []string           `json:"tags" bson:"tags"`
	Status       string             `json:"status" bson:"status"` // draft, published, archived
	PublishDate  *time.Time         `json:"publish_date" bson:"publish_date"`
	LastModified time.Time          `json:"last_modified" bson:"last_modified"`
	ReadTime     int                `json:"read_time" bson:"read_time"`
	ViewCount    int                `json:"view_count" bson:"view_count"`
	IsFeatured   bool               `json:"is_featured" bson:"is_featured"`
	Priority     int                `json:"priority" bson:"priority"`
	Source       Source             `json:"source" bson:"source"`
	CrawlData    CrawlData          `json:"crawl_data" bson:"crawl_data"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time          `json:"updated_at" bson:"updated_at"`
}

// Author 作者信息
type Author struct {
	ID     string `json:"id" bson:"id"`
	Name   string `json:"name" bson:"name"`
	Avatar string `json:"avatar" bson:"avatar"`
}

// Source 文章来源
type Source struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
	URL  string `json:"url" bson:"url"`
}

// CrawlData 爬虫数据
type CrawlData struct {
	OriginalURL string    `json:"original_url" bson:"original_url"`
	CrawledAt   time.Time `json:"crawled_at" bson:"crawled_at"`
	SourceHash  string    `json:"source_hash" bson:"source_hash"`
}

// ArticleFilter 文章过滤器
type ArticleFilter struct {
	Status     string   `json:"status" form:"status"`
	Category   string   `json:"category" form:"category"`
	Tags       []string `json:"tags" form:"tags"`
	Author     string   `json:"author" form:"author"`
	IsFeatured *bool    `json:"is_featured" form:"is_featured"`
	Keyword    string   `json:"keyword" form:"keyword"`
	StartDate  string   `json:"start_date" form:"start_date"`
	EndDate    string   `json:"end_date" form:"end_date"`
}

// ArticleRequest 创建/更新文章请求
type ArticleRequest struct {
	Title       string   `json:"title" binding:"required"`
	Content     string   `json:"content" binding:"required"`
	Excerpt     string   `json:"excerpt"`
	CoverImage  string   `json:"cover_image"`
	Category    string   `json:"category" binding:"required"`
	Tags        []string `json:"tags"`
	Status      string   `json:"status" binding:"required"`
	IsFeatured  bool     `json:"is_featured"`
	Priority    int      `json:"priority"`
	PublishDate string   `json:"publish_date"`
}

// PaginationRequest 分页请求
type PaginationRequest struct {
	Page     int `json:"page" form:"page" binding:"min=1"`
	PageSize int `json:"page_size" form:"page_size" binding:"min=1,max=100"`
}

// PaginationResponse 分页响应
type PaginationResponse struct {
	Page       int `json:"page"`
	PageSize   int `json:"page_size"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
} 
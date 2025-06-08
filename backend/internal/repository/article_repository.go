package repository

import (
	"context"
	"time"

	"ai-tracker-backend/internal/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ArticleRepository struct {
	collection *mongo.Collection
}

func NewArticleRepository(db *mongo.Database) *ArticleRepository {
	return &ArticleRepository{
		collection: db.Collection("articles"),
	}
}

// Create 创建文章
func (r *ArticleRepository) Create(ctx context.Context, article *model.Article) error {
	article.ID = primitive.NewObjectID()
	article.CreatedAt = time.Now()
	article.UpdatedAt = time.Now()
	article.LastModified = time.Now()

	_, err := r.collection.InsertOne(ctx, article)
	return err
}

// GetByID 根据ID获取文章
func (r *ArticleRepository) GetByID(ctx context.Context, id string) (*model.Article, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var article model.Article
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&article)
	if err != nil {
		return nil, err
	}

	// 增加浏览次数
	r.collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$inc": bson.M{"view_count": 1}},
	)

	return &article, nil
}

// List 获取文章列表
func (r *ArticleRepository) List(ctx context.Context, filter model.ArticleFilter, pagination model.PaginationRequest) ([]*model.Article, int64, error) {
	// 构建查询条件
	query := r.buildQuery(filter)

	// 计算总数
	total, err := r.collection.CountDocuments(ctx, query)
	if err != nil {
		return nil, 0, err
	}

	// 构建分页选项
	opts := options.Find()
	opts.SetSkip(int64((pagination.Page - 1) * pagination.PageSize))
	opts.SetLimit(int64(pagination.PageSize))

	// 排序：featured文章优先，然后按发布时间倒序
	opts.SetSort(bson.D{
		{Key: "is_featured", Value: -1},
		{Key: "priority", Value: -1},
		{Key: "publish_date", Value: -1},
	})

	// 查询数据
	cursor, err := r.collection.Find(ctx, query, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	if err = cursor.All(ctx, &articles); err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}

// GetFeatured 获取轮播文章
func (r *ArticleRepository) GetFeatured(ctx context.Context, limit int) ([]*model.Article, error) {
	opts := options.Find()
	opts.SetLimit(int64(limit))
	opts.SetSort(bson.D{
		{Key: "priority", Value: -1},
		{Key: "publish_date", Value: -1},
	})

	cursor, err := r.collection.Find(ctx, bson.M{
		"is_featured": true,
		"status":      "published",
		"publish_date": bson.M{"$lte": time.Now()},
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	err = cursor.All(ctx, &articles)
	return articles, err
}

// Update 更新文章
func (r *ArticleRepository) Update(ctx context.Context, id string, article *model.Article) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	article.UpdatedAt = time.Now()
	article.LastModified = time.Now()

	_, err = r.collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": article},
	)
	return err
}

// Delete 删除文章
func (r *ArticleRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

// GetByCategory 根据分类获取文章
func (r *ArticleRepository) GetByCategory(ctx context.Context, category string, limit int) ([]*model.Article, error) {
	opts := options.Find()
	opts.SetLimit(int64(limit))
	opts.SetSort(bson.D{{Key: "publish_date", Value: -1}})

	cursor, err := r.collection.Find(ctx, bson.M{
		"category": category,
		"status":   "published",
		"publish_date": bson.M{"$lte": time.Now()},
	}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	err = cursor.All(ctx, &articles)
	return articles, err
}

// Search 搜索文章
func (r *ArticleRepository) Search(ctx context.Context, keyword string, pagination model.PaginationRequest) ([]*model.Article, int64, error) {
	// 构建搜索查询
	searchQuery := bson.M{
		"$and": []bson.M{
			{"status": "published"},
			{"publish_date": bson.M{"$lte": time.Now()}},
			{
				"$or": []bson.M{
					{"title": bson.M{"$regex": keyword, "$options": "i"}},
					{"content": bson.M{"$regex": keyword, "$options": "i"}},
					{"excerpt": bson.M{"$regex": keyword, "$options": "i"}},
					{"tags": bson.M{"$in": []string{keyword}}},
				},
			},
		},
	}

	// 计算总数
	total, err := r.collection.CountDocuments(ctx, searchQuery)
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	opts := options.Find()
	opts.SetSkip(int64((pagination.Page - 1) * pagination.PageSize))
	opts.SetLimit(int64(pagination.PageSize))
	opts.SetSort(bson.D{{Key: "publish_date", Value: -1}})

	cursor, err := r.collection.Find(ctx, searchQuery, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	err = cursor.All(ctx, &articles)
	return articles, total, err
}

// buildQuery 构建查询条件
func (r *ArticleRepository) buildQuery(filter model.ArticleFilter) bson.M {
	query := bson.M{}

	if filter.Status != "" {
		query["status"] = filter.Status
	}

	if filter.Category != "" {
		query["category"] = filter.Category
	}

	if len(filter.Tags) > 0 {
		query["tags"] = bson.M{"$in": filter.Tags}
	}

	if filter.Author != "" {
		query["author.name"] = bson.M{"$regex": filter.Author, "$options": "i"}
	}

	if filter.IsFeatured != nil {
		query["is_featured"] = *filter.IsFeatured
	}

	if filter.Keyword != "" {
		query["$or"] = []bson.M{
			{"title": bson.M{"$regex": filter.Keyword, "$options": "i"}},
			{"content": bson.M{"$regex": filter.Keyword, "$options": "i"}},
			{"excerpt": bson.M{"$regex": filter.Keyword, "$options": "i"}},
		}
	}

	// 日期范围查询
	if filter.StartDate != "" || filter.EndDate != "" {
		dateQuery := bson.M{}
		if filter.StartDate != "" {
			if startDate, err := time.Parse("2006-01-02", filter.StartDate); err == nil {
				dateQuery["$gte"] = startDate
			}
		}
		if filter.EndDate != "" {
			if endDate, err := time.Parse("2006-01-02", filter.EndDate); err == nil {
				dateQuery["$lte"] = endDate.Add(24 * time.Hour)
			}
		}
		if len(dateQuery) > 0 {
			query["publish_date"] = dateQuery
		}
	}

	return query
}

// GetLatestArticles 获取最新文章（按发布时间排序）
func (r *ArticleRepository) GetLatestArticles(ctx context.Context, filter model.ArticleFilter, pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	collection := r.collection

	// 构建查询条件
	query := r.buildQuery(filter)

	// 计算总数
	total, err := collection.CountDocuments(ctx, query)
	if err != nil {
		return nil, nil, err
	}

	// 计算分页
	skip := (pagination.Page - 1) * pagination.PageSize
	totalPages := int((total + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))

	// 查询选项：按发布时间降序排序
	opts := options.Find().
		SetSort(bson.D{{"publish_date", -1}, {"created_at", -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(pagination.PageSize))

	cursor, err := collection.Find(ctx, query, opts)
	if err != nil {
		return nil, nil, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	if err = cursor.All(ctx, &articles); err != nil {
		return nil, nil, err
	}

	paginationResp := &model.PaginationResponse{
		Page:       pagination.Page,
		PageSize:   pagination.PageSize,
		Total:      int(total),
		TotalPages: totalPages,
		HasNext:    pagination.Page < totalPages,
		HasPrev:    pagination.Page > 1,
	}

	return articles, paginationResp, nil
}

// GetHotArticles 获取热门文章（按阅读量排序）
func (r *ArticleRepository) GetHotArticles(ctx context.Context, filter model.ArticleFilter, pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	collection := r.collection

	// 构建查询条件
	query := r.buildQuery(filter)

	// 计算总数
	total, err := collection.CountDocuments(ctx, query)
	if err != nil {
		return nil, nil, err
	}

	// 计算分页
	skip := (pagination.Page - 1) * pagination.PageSize
	totalPages := int((total + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))

	// 查询选项：按阅读量降序排序
	opts := options.Find().
		SetSort(bson.D{{"view_count", -1}, {"publish_date", -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(pagination.PageSize))

	cursor, err := collection.Find(ctx, query, opts)
	if err != nil {
		return nil, nil, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	if err = cursor.All(ctx, &articles); err != nil {
		return nil, nil, err
	}

	paginationResp := &model.PaginationResponse{
		Page:       pagination.Page,
		PageSize:   pagination.PageSize,
		Total:      int(total),
		TotalPages: totalPages,
		HasNext:    pagination.Page < totalPages,
		HasPrev:    pagination.Page > 1,
	}

	return articles, paginationResp, nil
}

// GetTrendingArticles 获取趋势文章（按综合热度排序）
func (r *ArticleRepository) GetTrendingArticles(ctx context.Context, filter model.ArticleFilter, pagination model.PaginationRequest) ([]*model.Article, *model.PaginationResponse, error) {
	collection := r.collection

	// 构建查询条件
	query := r.buildQuery(filter)

	// 计算总数
	total, err := collection.CountDocuments(ctx, query)
	if err != nil {
		return nil, nil, err
	}

	// 计算分页
	skip := (pagination.Page - 1) * pagination.PageSize
	totalPages := int((total + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))

	// 使用聚合管道计算综合热度分数
	pipeline := []bson.M{
		{"$match": query},
		{
			"$addFields": bson.M{
				"trending_score": bson.M{
					"$add": []interface{}{
						// 阅读量权重 (70%)
						bson.M{"$multiply": []interface{}{"$view_count", 0.7}},
						// 时间权重 (30%) - 越新的文章分数越高
						bson.M{
							"$multiply": []interface{}{
								bson.M{
									"$divide": []interface{}{
										bson.M{
											"$subtract": []interface{}{
												"$$NOW",
												bson.M{
													"$ifNull": []interface{}{"$publish_date", "$created_at"},
												},
											},
										},
										1000 * 60 * 60 * 24, // 转换为天数
									},
								},
								-0.3, // 负权重，越新分数越高
							},
						},
						// 优先级权重
						bson.M{"$multiply": []interface{}{"$priority", 10}},
					},
				},
			},
		},
		{"$sort": bson.D{{"trending_score", -1}}},
		{"$skip": int64(skip)},
		{"$limit": int64(pagination.PageSize)},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, nil, err
	}
	defer cursor.Close(ctx)

	var articles []*model.Article
	if err = cursor.All(ctx, &articles); err != nil {
		return nil, nil, err
	}

	paginationResp := &model.PaginationResponse{
		Page:       pagination.Page,
		PageSize:   pagination.PageSize,
		Total:      int(total),
		TotalPages: totalPages,
		HasNext:    pagination.Page < totalPages,
		HasPrev:    pagination.Page > 1,
	}

	return articles, paginationResp, nil
} 
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArticleFilter } from '@/types/article';

interface ArticleFiltersProps {
  filters: ArticleFilter;
  onFilterChange: (filters: ArticleFilter) => void;
}

// 模拟数据
const categories = [
  'AI 新闻',
  'AI 评测',
  'AI 教程',
  'AI 观点',
  'AI 应用',
];

const tags = [
  'GPT-4',
  'Claude',
  'Gemini',
  'OpenAI',
  'Anthropic',
  'Google',
];

export function ArticleFilters({ filters, onFilterChange }: ArticleFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ArticleFilter>(filters);

  // 处理状态变化
  const handleStatusChange = (status: string) => {
    const newFilters = {
      ...localFilters,
      status: status as ArticleFilter['status'],
    };
    setLocalFilters(newFilters);
  };

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    const newFilters = {
      ...localFilters,
      category,
    };
    setLocalFilters(newFilters);
  };

  // 处理标签变化
  const handleTagChange = (tag: string) => {
    const newFilters = {
      ...localFilters,
      tag,
    };
    setLocalFilters(newFilters);
  };

  // 应用筛选
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  // 重置筛选
  const handleResetFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 状态筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">状态</label>
          <Select
            value={localFilters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 分类筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">分类</label>
          <Select
            value={localFilters.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 标签筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">标签</label>
          <Select
            value={localFilters.tag}
            onValueChange={handleTagChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择标签" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 作者筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">作者</label>
          <Input
            placeholder="搜索作者"
            value={localFilters.author || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, author: e.target.value })
            }
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button
          variant="outline"
          onClick={handleResetFilters}
        >
          重置
        </Button>
        <Button onClick={handleApplyFilters}>
          应用筛选
        </Button>
      </div>
    </Card>
  );
}
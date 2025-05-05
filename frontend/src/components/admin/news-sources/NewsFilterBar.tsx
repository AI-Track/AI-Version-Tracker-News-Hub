import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface NewsFilterValues {
  search: string;
  category: string;
  status: string;
}

interface NewsFilterBarProps {
  onFilterChange: (filters: NewsFilterValues) => void;
  categoryOptions: { value: string; label: string }[];
}

export function NewsFilterBar({ onFilterChange, categoryOptions }: NewsFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<NewsFilterValues>({
    search: '',
    category: '',
    status: '',
  });

  const statusOptions = [
    { value: 'active', label: '运行中' },
    { value: 'paused', label: '已暂停' },
    { value: 'error', label: '错误' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof NewsFilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = { search: '', category: '', status: '' };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = filters.category || filters.status;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索新闻来源..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-8"
        />
        {filters.search && (
          <button
            onClick={() => handleFilterChange('search', '')}
            className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant={hasActiveFilters ? "default" : "outline"}>
            <Filter className="h-4 w-4 mr-2" />
            筛选
            {hasActiveFilters && (
              <span className="ml-1 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {(!!filters.category ? 1 : 0) + (!!filters.status ? 1 : 0)}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <h4 className="font-medium">筛选条件</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">分类</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有分类</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">状态</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="所有状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有状态</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                清除筛选
              </Button>
              <Button
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                应用
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 
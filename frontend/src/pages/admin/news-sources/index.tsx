import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewsSourceForm } from '@/components/admin/news-sources/NewsSourceForm';
import { NewsSourceList, NewsSource } from '@/components/admin/news-sources/NewsSourceList';
import { NewsStatistics } from '@/components/admin/news-sources/NewsStatistics';
import { NewsFilterBar, NewsFilterValues } from '@/components/admin/news-sources/NewsFilterBar';
import { NewsEditor } from '@/components/admin/news-sources/NewsEditor';

// 模拟数据
const mockNewsSources: NewsSource[] = [
  {
    id: '1',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog',
    category: 'AI 技术',
    status: 'active',
    lastCrawled: '2024-04-15T10:30:00Z',
    totalArticles: 128,
    crawlFrequency: '每6小时',
    crawlRules: {
      maxDepth: 1,
      followLinks: false,
      useAI: true
    }
  },
  {
    id: '2',
    name: 'Google AI Blog',
    url: 'https://ai.googleblog.com',
    category: 'AI 研究',
    status: 'active',
    lastCrawled: '2024-04-15T09:45:00Z',
    totalArticles: 256,
    crawlFrequency: '每12小时',
    crawlRules: {
      maxDepth: 1,
      followLinks: false,
      useAI: true
    }
  },
  {
    id: '3',
    name: 'Anthropic Blog',
    url: 'https://www.anthropic.com/blog',
    category: 'AI 安全',
    status: 'paused',
    lastCrawled: '2024-04-14T15:30:00Z',
    totalArticles: 64,
    crawlFrequency: '每天',
    crawlRules: {
      maxDepth: 1, 
      followLinks: false,
      useAI: true
    }
  }
];

// 分类选项
const categoryOptions = [
  { value: 'AI 技术', label: 'AI 技术' },
  { value: 'AI 研究', label: 'AI 研究' },
  { value: 'AI 安全', label: 'AI 安全' },
  { value: 'AI 应用', label: 'AI 应用' },
];

// 表单数据类型
interface FormData {
  name: string;
  url: string;
  category: string;
  crawlFrequency: string;
  crawlRules: {
    titleSelector?: string;
    contentSelector?: string;
    dateSelector?: string;
    authorSelector?: string;
    listSelector?: string;
    maxDepth: number;
    followLinks: boolean;
    useAI: boolean;
    excludePatterns?: string;
  };
}

// 页面显示模式
type DisplayMode = 'list' | 'editor';

export default function NewsSourcesPage() {
  const [newsSources, setNewsSources] = useState<NewsSource[]>(mockNewsSources);
  const [filteredSources, setFilteredSources] = useState<NewsSource[]>(mockNewsSources);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);
  const [todayCrawlCount, setTodayCrawlCount] = useState(12); // 模拟数据
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  
  // 添加新闻来源
  const handleAddSource = () => {
    setEditingSource(null);
    setIsFormOpen(true);
  };

  // 编辑新闻来源
  const handleEditSource = (sourceId: string) => {
    const source = newsSources.find(s => s.id === sourceId);
    if (source) {
      setEditingSource(source);
      setIsFormOpen(true);
    }
  };

  // 打开详细编辑页面
  const handleOpenEditor = (sourceId: string) => {
    const source = newsSources.find(s => s.id === sourceId);
    if (source) {
      setSelectedSource(source);
      setDisplayMode('editor');
    }
  };

  // 删除新闻来源
  const handleDeleteSource = (sourceId: string) => {
    // 实现删除逻辑
    setNewsSources(newsSources.filter(source => source.id !== sourceId));
  };

  // 立即抓取
  const handleCrawlNow = (sourceId: string) => {
    // 更新最近抓取时间
    setNewsSources(newsSources.map(source => {
      if (source.id === sourceId) {
        return { 
          ...source, 
          lastCrawled: new Date().toISOString(),
          // 模拟新增几篇文章
          totalArticles: source.totalArticles + Math.floor(Math.random() * 5)
        };
      }
      return source;
    }));
    
    // 增加今日抓取计数
    setTodayCrawlCount(prev => prev + 1);
  };

  // 表单提交
  const handleFormSubmit = (data: FormData) => {
    if (editingSource) {
      // 更新现有来源
      setNewsSources(newsSources.map(source => 
        source.id === editingSource.id 
          ? { ...source, ...data }
          : source
      ));
    } else {
      // 添加新来源
      const newSource: NewsSource = {
        id: `${Date.now()}`, // 简单生成ID
        ...data,
        status: 'active',
        lastCrawled: new Date().toISOString(),
        totalArticles: 0
      };
      setNewsSources([...newsSources, newSource]);
    }
    setIsFormOpen(false);
  };

  // 切换来源状态
  const handleToggleStatus = (sourceId: string) => {
    setNewsSources(newsSources.map(source => {
      if (source.id === sourceId) {
        const newStatus = source.status === 'active' ? 'paused' : 'active';
        return { ...source, status: newStatus };
      }
      return source;
    }));
  };
  
  // 处理筛选
  const handleFilterChange = (filters: NewsFilterValues) => {
    let filtered = [...newsSources];
    
    // 搜索过滤
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(source => 
        source.name.toLowerCase().includes(searchTerm) || 
        source.url.toLowerCase().includes(searchTerm)
      );
    }
    
    // 分类过滤
    if (filters.category) {
      filtered = filtered.filter(source => source.category === filters.category);
    }
    
    // 状态过滤
    if (filters.status) {
      filtered = filtered.filter(source => source.status === filters.status);
    }
    
    setFilteredSources(filtered);
  };
  
  // 保存详细编辑
  const handleSaveEdited = (updatedSource: NewsSource) => {
    setNewsSources(prevSources => 
      prevSources.map(source => 
        source.id === updatedSource.id ? updatedSource : source
      )
    );
    setDisplayMode('list');
    setSelectedSource(null);
  };
  
  // 测试抓取
  const handleTestCrawl = (source: NewsSource) => {
    console.log('测试抓取:', source.url);
    // 实际项目中应该调用API进行测试抓取
  };
  
  // 当数据源变化时更新筛选结果
  useEffect(() => {
    setFilteredSources(newsSources);
  }, [newsSources]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {displayMode === 'list' ? (
          <>
            {/* 头部操作栏 */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">新闻来源管理</h1>
              <Button onClick={handleAddSource}>
                <Plus className="w-4 h-4 mr-2" />
                添加来源
              </Button>
            </div>
            
            {/* 统计卡片 */}
            <NewsStatistics 
              sources={newsSources} 
              todayCrawlCount={todayCrawlCount} 
            />
            
            {/* 筛选栏 */}
            <div className="pt-4">
              <NewsFilterBar 
                onFilterChange={handleFilterChange}
                categoryOptions={categoryOptions}
              />
            </div>

            {/* 新闻来源列表 */}
            <NewsSourceList 
              sources={filteredSources}
              onEditSource={handleOpenEditor}
              onDeleteSource={handleDeleteSource}
              onToggleStatus={handleToggleStatus}
              onCrawlNow={handleCrawlNow}
            />
            
            {/* 新闻来源表单 */}
            <NewsSourceForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleFormSubmit}
              initialData={editingSource || undefined}
            />
          </>
        ) : (
          /* 详细编辑页面 */
          selectedSource && (
            <NewsEditor 
              newsSource={selectedSource}
              onSave={handleSaveEdited}
              onBack={() => {
                setDisplayMode('list');
                setSelectedSource(null);
              }}
              onTestCrawl={handleTestCrawl}
            />
          )
        )}
      </div>
    </AdminLayout>
  );
} 
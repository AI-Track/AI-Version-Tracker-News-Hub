import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Newspaper } from 'lucide-react';

// 临时的类型定义
interface Content {
  id: string;
  title: string;
  source: string;
  type: 'article' | 'update';
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
}

// 模拟数据
const mockContents: Content[] = [
  {
    id: '1',
    title: 'OpenAI发布GPT-4重大更新',
    source: 'OpenAI Blog',
    type: 'update',
    publishDate: '2024-04-15T10:30:00Z',
    status: 'published',
    category: 'AI Updates'
  },
  {
    id: '2',
    title: 'AI在医疗领域的最新应用',
    source: 'AI Research Weekly',
    type: 'article',
    publishDate: '2024-04-14T15:20:00Z',
    status: 'published',
    category: 'AI Applications'
  }
];

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>(mockContents);
  const [activeTab, setActiveTab] = useState('all');

  const filteredContents = activeTab === 'all' 
    ? contents 
    : contents.filter(content => content.type === activeTab);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">内容管理</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建内容
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">总内容数</h3>
            <p className="text-2xl font-bold">{contents.length}</p>
          </div>
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">文章数量</h3>
            <p className="text-2xl font-bold">
              {contents.filter(c => c.type === 'article').length}
            </p>
          </div>
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">更新数量</h3>
            <p className="text-2xl font-bold">
              {contents.filter(c => c.type === 'update').length}
            </p>
          </div>
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">已发布</h3>
            <p className="text-2xl font-bold">
              {contents.filter(c => c.status === 'published').length}
            </p>
          </div>
        </div>

        {/* 内容列表 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              全部
            </TabsTrigger>
            <TabsTrigger value="article" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              文章
            </TabsTrigger>
            <TabsTrigger value="update" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              更新
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="border rounded-lg">
              <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted">
                <div className="col-span-2">标题</div>
                <div>来源</div>
                <div>类型</div>
                <div>发布时间</div>
                <div>状态</div>
              </div>
              <div className="divide-y">
                {filteredContents.map(item => (
                  <div key={item.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-2">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                    <div>{item.source}</div>
                    <div>
                      <span className="flex items-center gap-1">
                        {item.type === 'article' ? (
                          <><FileText className="w-4 h-4" /> 文章</>
                        ) : (
                          <><Newspaper className="w-4 h-4" /> 更新</>
                        )}
                      </span>
                    </div>
                    <div>{new Date(item.publishDate).toLocaleDateString()}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : item.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {{
                          published: '已发布',
                          draft: '草稿',
                          archived: '已归档'
                        }[item.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
} 
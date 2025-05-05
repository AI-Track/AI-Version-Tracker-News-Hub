import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// 临时的类型定义
interface AIUpdate {
  id: string;
  name: string;
  provider: string;
  currentVersion: string;
  lastUpdated: string;
  description: string;
  updateUrl: string;
  type: 'model' | 'library' | 'api';
  status: 'active' | 'paused';
}

// 模拟数据
const mockAIUpdates: AIUpdate[] = [
  {
    id: '1',
    name: 'GPT-4',
    provider: 'OpenAI',
    currentVersion: '4.0',
    lastUpdated: '2024-04-15T10:30:00Z',
    description: 'OpenAI的最新语言模型',
    updateUrl: 'https://platform.openai.com/docs/models',
    type: 'model',
    status: 'active'
  },
  {
    id: '2',
    name: 'Claude 3',
    provider: 'Anthropic',
    currentVersion: '3.0',
    lastUpdated: '2024-04-14T15:20:00Z',
    description: 'Anthropic的新一代AI助手',
    updateUrl: 'https://www.anthropic.com/news',
    type: 'model',
    status: 'active'
  }
];

export default function AIUpdatesPage() {
  const [aiUpdates, setAIUpdates] = useState<AIUpdate[]>(mockAIUpdates);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI 更新追踪</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加追踪项
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">追踪项目</h3>
            <p className="text-2xl font-bold">{aiUpdates.length}</p>
          </div>
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">最近更新</h3>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium text-muted-foreground">活跃追踪</h3>
            <p className="text-2xl font-bold">
              {aiUpdates.filter(item => item.status === 'active').length}
            </p>
          </div>
        </div>

        {/* AI更新列表 */}
        <div className="border rounded-lg">
          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted">
            <div className="col-span-2">名称</div>
            <div>提供商</div>
            <div>当前版本</div>
            <div>最近更新</div>
            <div>状态</div>
          </div>
          <div className="divide-y">
            {aiUpdates.map(item => (
              <div key={item.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                <div className="col-span-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <div>{item.provider}</div>
                <div>{item.currentVersion}</div>
                <div>{new Date(item.lastUpdated).toLocaleDateString()}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status === 'active' ? '追踪中' : '已暂停'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
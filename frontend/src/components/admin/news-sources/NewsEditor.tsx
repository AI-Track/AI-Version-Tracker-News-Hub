import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Save, ArrowLeft, PlayCircle, Code } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { NewsSource } from './NewsSourceList';
import { NewsCrawlHistory } from './NewsCrawlHistory';

interface NewsEditorProps {
  newsSource: NewsSource;
  onSave: (newsSource: NewsSource) => void;
  onBack: () => void;
  onTestCrawl: (newsSource: NewsSource) => void;
}

// 示例历史记录数据
const mockCrawlHistory = [
  {
    id: '1',
    sourceId: '1',
    sourceName: 'OpenAI Blog',
    status: 'success' as const,
    startTime: '2024-04-15T10:30:00Z',
    endTime: '2024-04-15T10:32:45Z',
    articlesFound: 12,
    articlesAdded: 5,
  },
  {
    id: '2',
    sourceId: '1',
    sourceName: 'OpenAI Blog',
    status: 'failed' as const,
    startTime: '2024-04-14T10:30:00Z',
    endTime: '2024-04-14T10:31:20Z',
    articlesFound: 0,
    articlesAdded: 0,
    error: '网站返回 403 错误，可能是访问频率限制',
  },
  {
    id: '3',
    sourceId: '1',
    sourceName: 'OpenAI Blog',
    status: 'success' as const,
    startTime: '2024-04-13T10:30:00Z',
    endTime: '2024-04-13T10:33:10Z',
    articlesFound: 15,
    articlesAdded: 8,
  },
];

export function NewsEditor({ 
  newsSource, 
  onSave, 
  onBack,
  onTestCrawl
}: NewsEditorProps) {
  const [editedSource, setEditedSource] = useState<NewsSource>({ ...newsSource });
  const [activeTab, setActiveTab] = useState('basic');
  const [testResults, setTestResults] = useState<null | {
    success: boolean;
    message: string;
    previewData?: {
      title?: string;
      content?: string;
      date?: string;
      author?: string;
      links?: string[];
    };
  }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [crawlHistory, setCrawlHistory] = useState(mockCrawlHistory);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedSource((prev) => ({ ...prev, [name]: value }));
  };

  const handleRuleChange = (
    name: string,
    value: string | boolean | number
  ) => {
    setEditedSource((prev) => ({
      ...prev,
      crawlRules: {
        ...prev.crawlRules!,
        [name]: value,
      },
    }));
  };

  const handleTestCrawl = () => {
    // 实际项目中应该调用API进行测试抓取
    // 这里模拟一个异步操作
    setTestResults(null);
    
    setTimeout(() => {
      const success = Math.random() > 0.3; // 随机模拟成功或失败
      
      if (success) {
        setTestResults({
          success: true,
          message: '测试抓取成功',
          previewData: {
            title: '人工智能在医疗领域的最新进展',
            content: '近日，研究人员开发了一种新的AI模型，可以准确预测患者的健康风险...',
            date: '2024-04-15',
            author: 'AI研究团队',
            links: [
              'https://example.com/article1',
              'https://example.com/article2',
            ],
          },
        });
      } else {
        setTestResults({
          success: false,
          message: '测试抓取失败，请检查选择器规则或网站访问限制',
        });
      }
    }, 1500);
  };

  const handleSave = () => {
    onSave(editedSource);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">编辑新闻来源: {newsSource.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onTestCrawl(editedSource)}
            className="flex items-center"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            测试抓取
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="crawlRules">抓取规则</TabsTrigger>
          <TabsTrigger value="preview">测试预览</TabsTrigger>
          <TabsTrigger value="history">抓取历史</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                设置新闻来源的基本信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名称</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editedSource.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Input
                    id="category"
                    name="category"
                    value={editedSource.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={editedSource.url}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crawlFrequency">抓取频率</Label>
                <Input
                  id="crawlFrequency"
                  name="crawlFrequency"
                  value={editedSource.crawlFrequency}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>状态信息</CardTitle>
              <CardDescription>
                查看当前抓取状态和统计数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>状态</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editedSource.status === 'active'}
                      onCheckedChange={(checked: boolean) => {
                        setEditedSource((prev) => ({
                          ...prev,
                          status: checked ? 'active' : 'paused',
                        }));
                      }}
                    />
                    <span>{editedSource.status === 'active' ? '运行中' : '已暂停'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>最近抓取</Label>
                  <div>{new Date(editedSource.lastCrawled).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>文章数</Label>
                <div>{editedSource.totalArticles} 篇</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crawlRules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>抓取模式</CardTitle>
              <CardDescription>
                选择使用AI自动识别或手动配置选择器
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editedSource.crawlRules?.useAI ?? true}
                  onCheckedChange={(checked: boolean) => {
                    handleRuleChange('useAI', checked);
                  }}
                />
                <Label>使用AI自动识别</Label>
              </div>
              
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  启用AI自动识别后，系统将智能分析网页结构，无需手动配置选择器。
                  对于结构复杂的网站，您可能需要手动配置以获得更精确的结果。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          {!(editedSource.crawlRules?.useAI ?? true) && (
            <Card>
              <CardHeader>
                <CardTitle>CSS选择器配置</CardTitle>
                <CardDescription>
                  为不同内容元素配置CSS选择器
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="listSelector">列表选择器</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="listSelector"
                      value={editedSource.crawlRules?.listSelector || ''}
                      onChange={(e) => handleRuleChange('listSelector', e.target.value)}
                      placeholder=".article-list .item"
                    />
                    <Button variant="outline" size="icon">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    用于选择文章列表项的CSS选择器
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titleSelector">标题选择器</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="titleSelector"
                      value={editedSource.crawlRules?.titleSelector || ''}
                      onChange={(e) => handleRuleChange('titleSelector', e.target.value)}
                      placeholder=".article-title, h1"
                    />
                    <Button variant="outline" size="icon">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentSelector">内容选择器</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="contentSelector"
                      value={editedSource.crawlRules?.contentSelector || ''}
                      onChange={(e) => handleRuleChange('contentSelector', e.target.value)}
                      placeholder=".article-content"
                    />
                    <Button variant="outline" size="icon">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateSelector">日期选择器</Label>
                    <Input
                      id="dateSelector"
                      value={editedSource.crawlRules?.dateSelector || ''}
                      onChange={(e) => handleRuleChange('dateSelector', e.target.value)}
                      placeholder=".publish-date"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authorSelector">作者选择器</Label>
                    <Input
                      id="authorSelector"
                      value={editedSource.crawlRules?.authorSelector || ''}
                      onChange={(e) => handleRuleChange('authorSelector', e.target.value)}
                      placeholder=".author-name"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="excludePatterns">排除模式</Label>
                  <Textarea
                    id="excludePatterns"
                    value={editedSource.crawlRules?.excludePatterns || ''}
                    onChange={(e) => handleRuleChange('excludePatterns', e.target.value)}
                    placeholder="每行一个正则表达式，匹配的URL将被排除"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    排除不需要抓取的URL，例如: .*\\/tag\\/.*
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>抓取设置</CardTitle>
              <CardDescription>
                设置抓取深度和链接跟踪
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="maxDepth">最大抓取深度: {editedSource.crawlRules?.maxDepth || 1}</Label>
                  </div>
                  <Slider
                    id="maxDepth"
                    min={1}
                    max={5}
                    step={1}
                    value={[editedSource.crawlRules?.maxDepth || 1]}
                    onValueChange={(value: number[]) => handleRuleChange('maxDepth', value[0])}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    设置抓取深度，1表示只抓取主页，更高的值将跟踪更多页面
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedSource.crawlRules?.followLinks || false}
                    onCheckedChange={(checked: boolean) => {
                      handleRuleChange('followLinks', checked);
                    }}
                  />
                  <Label>跟踪页面内链接</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  启用后，将跟踪页面中的链接并抓取相关内容
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>抓取测试</CardTitle>
              <CardDescription>
                测试当前配置的抓取规则
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleTestCrawl}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  执行测试抓取
                </Button>
                
                {testResults === null ? (
                  <div className="py-8 text-center text-muted-foreground">
                    点击上方按钮开始测试
                  </div>
                ) : testResults.success ? (
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="text-green-600 font-medium">
                      {testResults.message}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">抓取预览:</h3>
                      
                      <div className="space-y-1">
                        <div className="font-medium">标题:</div>
                        <div className="border p-2 rounded-md">
                          {testResults.previewData?.title}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-medium">内容摘要:</div>
                        <div className="border p-2 rounded-md h-24 overflow-y-auto">
                          {testResults.previewData?.content}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">日期:</div>
                          <div className="border p-2 rounded-md">
                            {testResults.previewData?.date}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="font-medium">作者:</div>
                          <div className="border p-2 rounded-md">
                            {testResults.previewData?.author}
                          </div>
                        </div>
                      </div>
                      
                      {testResults.previewData?.links && (
                        <div className="space-y-1">
                          <div className="font-medium">发现的链接:</div>
                          <div className="border p-2 rounded-md h-24 overflow-y-auto">
                            <ul className="list-disc list-inside">
                              {testResults.previewData.links.map((link, i) => (
                                <li key={i} className="truncate">
                                  {link}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border p-4 rounded-md bg-red-50 text-red-700">
                    {testResults.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <NewsCrawlHistory
            history={crawlHistory}
            currentPage={currentPage}
            totalPages={2}
            onPageChange={setCurrentPage}
            sourceId={newsSource.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
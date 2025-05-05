import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  url: z.string().url('请输入有效的URL'),
  category: z.string().min(1, '请选择分类'),
  crawlFrequency: z.string().min(1, '请选择抓取频率'),
  // 抓取规则配置
  crawlRules: z.object({
    titleSelector: z.string().optional(),
    contentSelector: z.string().optional(),
    dateSelector: z.string().optional(),
    authorSelector: z.string().optional(),
    listSelector: z.string().optional(),
    maxDepth: z.number().min(0).max(5).default(1),
    followLinks: z.boolean().default(false),
    useAI: z.boolean().default(true),
    excludePatterns: z.string().optional(),
  }),
});

// 定义表单数据类型
type FormData = z.infer<typeof formSchema>;

// 分类选项
const categoryOptions = [
  { value: 'AI 技术', label: 'AI 技术' },
  { value: 'AI 研究', label: 'AI 研究' },
  { value: 'AI 安全', label: 'AI 安全' },
  { value: 'AI 应用', label: 'AI 应用' },
];

// 抓取频率选项
const frequencyOptions = [
  { value: '每6小时', label: '每6小时' },
  { value: '每12小时', label: '每12小时' },
  { value: '每天', label: '每天' },
  { value: '每周', label: '每周' },
];

interface NewsSourceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export function NewsSourceForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: NewsSourceFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      url: initialData?.url || '',
      category: initialData?.category || '',
      crawlFrequency: initialData?.crawlFrequency || '',
      crawlRules: {
        titleSelector: initialData?.crawlRules?.titleSelector || '',
        contentSelector: initialData?.crawlRules?.contentSelector || '',
        dateSelector: initialData?.crawlRules?.dateSelector || '',
        authorSelector: initialData?.crawlRules?.authorSelector || '',
        listSelector: initialData?.crawlRules?.listSelector || '',
        maxDepth: initialData?.crawlRules?.maxDepth || 1,
        followLinks: initialData?.crawlRules?.followLinks || false,
        useAI: initialData?.crawlRules?.useAI ?? true,
        excludePatterns: initialData?.crawlRules?.excludePatterns || '',
      },
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '编辑新闻来源' : '添加新闻来源'}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="crawlRules">抓取规则</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名称</FormLabel>
                      <FormControl>
                        <Input placeholder="输入新闻来源名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="输入新闻来源URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crawlFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>抓取频率</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择抓取频率" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="crawlRules" className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="crawlRules.useAI"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>使用AI自动提取</FormLabel>
                          <FormDescription>
                            启用后系统将自动识别网页结构，无需手动配置选择器
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch('crawlRules.useAI') && (
                    <>
                      <FormField
                        control={form.control}
                        name="crawlRules.listSelector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>列表选择器</FormLabel>
                            <FormControl>
                              <Input placeholder="例如: .article-list .item" {...field} />
                            </FormControl>
                            <FormDescription>
                              用于选择文章列表项的CSS选择器
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crawlRules.titleSelector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>标题选择器</FormLabel>
                            <FormControl>
                              <Input placeholder="例如: .article-title" {...field} />
                            </FormControl>
                            <FormDescription>
                              用于提取文章标题的CSS选择器
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crawlRules.contentSelector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>内容选择器</FormLabel>
                            <FormControl>
                              <Input placeholder="例如: .article-content" {...field} />
                            </FormControl>
                            <FormDescription>
                              用于提取文章内容的CSS选择器
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="crawlRules.dateSelector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>日期选择器</FormLabel>
                              <FormControl>
                                <Input placeholder="例如: .publish-date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="crawlRules.authorSelector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>作者选择器</FormLabel>
                              <FormControl>
                                <Input placeholder="例如: .author-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="crawlRules.followLinks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>跟踪链接</FormLabel>
                          <FormDescription>
                            是否抓取文章内的链接
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('crawlRules.followLinks') && (
                    <FormField
                      control={form.control}
                      name="crawlRules.maxDepth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最大抓取深度: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            设置链接跟踪的最大深度（1-5）
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="crawlRules.excludePatterns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>排除模式</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="每行一个URL模式，例如: */archive/*, */tag/*"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          要排除的URL模式，每行一个
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  取消
                </Button>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 
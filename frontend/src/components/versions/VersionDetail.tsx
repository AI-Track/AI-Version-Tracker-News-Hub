import { ProductVersion } from '@/types/product';
import { cn } from '@/lib/utils';

interface VersionDetailProps {
  version: ProductVersion;
}

// 建议的文章接口定义 / Suggested Article Interface
interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishDate: Date;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  source: string;
  lastModified: Date;
  language: 'en' | 'zh';
}

export function VersionDetail({ version }: VersionDetailProps) {
  return (
    <div className="space-y-8">
      {/* 版本头部 */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">v{version.version}</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {new Date(version.date).toLocaleDateString()}
            </span>
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              version.importance === 'high' ? 'bg-red-100 text-red-800' :
              version.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            )}>
              {version?.importance?.toUpperCase()}
            </span>
          </div>
        </div>
        {version.details && (
          <p className="mt-4 text-muted-foreground">
            {version.details}
          </p>
        )}
      </div>

      {/* 更新内容 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">更新内容</h2>
        <ul className="space-y-2">
          {version.changes.map((change, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 新功能展示 */}
      {version.features && version.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">新功能亮点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {version.features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="mt-4 rounded-md w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
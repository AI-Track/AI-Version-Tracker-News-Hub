import { ProductVersion } from '@/types/product';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface VersionTimelineProps {
  versions: ProductVersion[];
  currentVersion?: string;
  productId: string;
}

export function VersionTimeline({ versions, currentVersion, productId }: VersionTimelineProps) {
  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <Link
          key={version.version}
          href={`/products/${productId}/versions/${version.version}`}
          className={cn(
            'block p-4 rounded-lg border transition-colors',
            version.version === currentVersion
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">v{version.version}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(version.date).toLocaleDateString()}
            </div>
          </div>
          {version.type && (
            <div className="mt-2">
              <span className={cn(
                'inline-block px-2 py-1 text-xs rounded',
                version.type === 'major' ? 'bg-red-100 text-red-800' :
                version.type === 'minor' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              )}>
                {version.type.toUpperCase()}
              </span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
} 
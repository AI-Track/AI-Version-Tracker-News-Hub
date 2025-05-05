import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityLog {
  id: string;
  type: 'edit' | 'status_change' | 'publish';
  articleId: string;
  articleTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  details: {
    from?: string;
    to?: string;
    description?: string;
  };
}

interface ArticleActivityLogProps {
  logs: ActivityLog[];
}

const activityTypeLabels = {
  edit: '编辑',
  status_change: '状态更新',
  publish: '发布',
};

const activityTypeColors = {
  edit: 'bg-blue-500',
  status_change: 'bg-yellow-500',
  publish: 'bg-green-500',
};

export function ArticleActivityLog({ logs }: ArticleActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>操作记录</CardTitle>
        <CardDescription>显示最近的文章操作记录</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              {/* 用户头像 */}
              <div className="flex-shrink-0">
                {log.userAvatar ? (
                  <img
                    src={log.userAvatar}
                    alt={log.userName}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {log.userName.charAt(0)}
                  </div>
                )}
              </div>

              {/* 操作详情 */}
              <div className="flex-grow space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{log.userName}</span>
                  <Badge
                    variant="secondary"
                    className={`${activityTypeColors[log.type]} text-white`}
                  >
                    {activityTypeLabels[log.type]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">{log.articleTitle}</span>
                  {log.type === 'status_change' && (
                    <span className="text-muted-foreground">
                      {' '}状态从 {log.details.from} 更新为 {log.details.to}
                    </span>
                  )}
                  {log.type === 'edit' && log.details.description && (
                    <span className="text-muted-foreground">
                      {' '}{log.details.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
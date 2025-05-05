import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Eye, RotateCcw } from "lucide-react";

interface ArticleVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  modifiedAt: string;
  modifiedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: string[];
}

interface ArticleHistoryProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (versionId: string) => Promise<void>;
  onViewVersion: (versionId: string) => void;
}

export function ArticleHistory({
  articleId,
  isOpen,
  onClose,
  onRestore,
  onViewVersion,
}: ArticleHistoryProps) {
  const [versions, setVersions] = useState<ArticleVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);

  // 处理版本恢复
  const handleRestore = async (versionId: string) => {
    try {
      setRestoringVersion(versionId);
      await onRestore(versionId);
      // 可以添加成功提示
    } catch (error) {
      // 处理错误
      console.error('Failed to restore version:', error);
    } finally {
      setRestoringVersion(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>版本历史记录</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>版本</TableHead>
                <TableHead>修改时间</TableHead>
                <TableHead>修改人</TableHead>
                <TableHead>修改内容</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>v{version.version}</TableCell>
                  <TableCell>{formatDate(version.modifiedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {version.modifiedBy.avatar && (
                        <img
                          src={version.modifiedBy.avatar}
                          alt={version.modifiedBy.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{version.modifiedBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {version.changes.map((change, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {change}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewVersion(version.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(version.id)}
                        disabled={restoringVersion === version.id}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
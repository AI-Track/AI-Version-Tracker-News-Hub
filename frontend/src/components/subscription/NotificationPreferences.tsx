import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Subscription } from '@/types/product';

interface NotificationPreferencesProps {
  preferences: Subscription['preferences'];
  onUpdate: (preferences: Subscription['preferences']) => Promise<void>;
  isUpdating?: boolean;
}

export function NotificationPreferences({
  preferences: initialPreferences,
  onUpdate,
  isUpdating
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof Subscription['preferences']) => {
    setPreferences(prev => {
      const newPreferences = {
        ...prev,
        [key]: !prev[key]
      };
      setHasChanges(true);
      return newPreferences;
    });
  };

  const handleSave = async () => {
    await onUpdate(preferences);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">邮件通知</div>
            <div className="text-sm text-muted-foreground">
              接收产品更新的邮件通知
            </div>
          </div>
          <Switch
            checked={preferences.email}
            onCheckedChange={() => handleChange('email')}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">浏览器通知</div>
            <div className="text-sm text-muted-foreground">
              接收产品更新的浏览器推送通知
            </div>
          </div>
          <Switch
            checked={preferences.push}
            onCheckedChange={() => handleChange('push')}
            disabled={isUpdating}
          />
        </div>

        <div className="border-t pt-4">
          <div className="font-medium mb-4">更新类型</div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">主要更新</div>
                <div className="text-sm text-muted-foreground">
                  重大版本更新和新功能发布
                </div>
              </div>
              <Switch
                checked={preferences.majorUpdates}
                onCheckedChange={() => handleChange('majorUpdates')}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">次要更新</div>
                <div className="text-sm text-muted-foreground">
                  功能改进和优化
                </div>
              </div>
              <Switch
                checked={preferences.minorUpdates}
                onCheckedChange={() => handleChange('minorUpdates')}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">补丁更新</div>
                <div className="text-sm text-muted-foreground">
                  问题修复和小改动
                </div>
              </div>
              <Switch
                checked={preferences.patchUpdates}
                onCheckedChange={() => handleChange('patchUpdates')}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!hasChanges || isUpdating}
        className="w-full"
      >
        {isUpdating ? '保存中...' : '保存设置'}
      </Button>
    </div>
  );
} 
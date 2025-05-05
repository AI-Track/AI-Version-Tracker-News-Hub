export type ActivityType = 'edit' | 'publish' | 'status_change';

export interface ActivityLogDetails {
  description?: string;
  from?: string;
  to?: string;
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  articleId: string;
  articleTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  details: ActivityLogDetails;
} 
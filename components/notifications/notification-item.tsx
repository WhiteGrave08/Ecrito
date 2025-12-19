'use client';

import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { markAsRead, deleteNotification } from '@/app/actions/notification-actions';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  read: boolean;
  created_at: string;
  actor: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  blog: {
    title: string;
    slug: string;
  } | null;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'new_blog':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    const actorName = notification.actor?.full_name || 'Someone';
    
    switch (notification.type) {
      case 'like':
        return (
          <>
            <strong>{actorName}</strong> liked your blog{' '}
            {notification.blog && (
              <Link href={`/blog/${notification.blog.slug}`} className="text-primary hover:underline">
                "{notification.blog.title}"
              </Link>
            )}
          </>
        );
      case 'comment':
        return (
          <>
            <strong>{actorName}</strong> commented on your blog{' '}
            {notification.blog && (
              <Link href={`/blog/${notification.blog.slug}`} className="text-primary hover:underline">
                "{notification.blog.title}"
              </Link>
            )}
          </>
        );
      case 'follow':
        return (
          <>
            <strong>{actorName}</strong> started following you
          </>
        );
      case 'new_blog':
        return (
          <>
            <strong>{actorName}</strong> published a new blog{' '}
            {notification.blog && (
              <Link href={`/blog/${notification.blog.slug}`} className="text-primary hover:underline">
                "{notification.blog.title}"
              </Link>
            )}
          </>
        );
      default:
        return 'New notification';
    }
  };

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
    router.refresh();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 hover:bg-secondary/50 cursor-pointer transition-colors relative ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
    >
      {/* Avatar */}
      {notification.actor?.avatar_url ? (
        <img
          src={notification.actor.avatar_url}
          alt={notification.actor.username}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold">
            {notification.actor?.full_name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {getIcon()}
          <p className="text-sm flex-1">
            {getMessage()}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 p-1 rounded transition-opacity flex-shrink-0"
        aria-label="Delete notification"
      >
        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
}

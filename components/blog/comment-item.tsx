'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { CommentForm } from './comment-form';
import { updateComment, deleteComment } from '@/app/actions/comment-actions';
import { useRouter } from 'next/navigation';

interface CommentItemProps {
  comment: any;
  currentUserId: string;
  blogId: string;
}

export function CommentItem({ comment, currentUserId, blogId }: CommentItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isOwner = currentUserId === comment.user_id;

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    setLoading(true);
    const result = await updateComment(comment.id, editContent);

    if (result.error) {
      alert(result.error);
    } else {
      setIsEditing(false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    const result = await deleteComment(comment.id);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.author?.avatar_url ? (
          <img
            src={comment.author.avatar_url}
            alt={comment.author.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold">
              {comment.author?.full_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author?.full_name}</span>
              <span className="text-xs text-muted-foreground">
                @{comment.author?.username}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
              {comment.updated_at !== comment.created_at && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-md min-h-[80px] resize-none"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdate} disabled={loading || !editContent.trim()}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Reply
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-destructive hover:text-destructive/80"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                blogId={blogId}
                parentId={comment.id}
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
                placeholder={`Reply to ${comment.author?.username}...`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

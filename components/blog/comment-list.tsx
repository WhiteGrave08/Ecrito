'use client';

import { CommentItem } from './comment-item';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  blogId: string;
}

export function CommentList({ comments, currentUserId, blogId }: CommentListProps) {
  // Organize comments into a tree structure
  const commentMap = new Map<string, Comment>();
  const topLevelComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into tree
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      } else {
        // Parent doesn't exist, treat as top-level
        topLevelComments.push(commentWithReplies);
      }
    } else {
      topLevelComments.push(commentWithReplies);
    }
  });

  // Render comment and its replies recursively
  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={depth > 0 ? 'ml-12 mt-4' : ''}>
      <CommentItem comment={comment} currentUserId={currentUserId} blogId={blogId} />
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topLevelComments.map(comment => renderComment(comment))}
    </div>
  );
}

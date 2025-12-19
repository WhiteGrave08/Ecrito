-- Notifications System Migration
-- This creates the notifications table with database triggers for automatic notification creation

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'new_blog'
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can create notifications (handled by triggers)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Database Triggers for Automatic Notifications

-- 1. Trigger for new likes
CREATE OR REPLACE FUNCTION notify_blog_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the blog author and create notification if it's not a self-like
  INSERT INTO notifications (user_id, type, actor_id, blog_id)
  SELECT b.author_id, 'like', NEW.user_id, NEW.blog_id
  FROM blogs b
  WHERE b.id = NEW.blog_id
  AND b.author_id != NEW.user_id; -- Don't notify self
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_blog_like
  AFTER INSERT ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_blog_like();

-- 2. Trigger for new comments
CREATE OR REPLACE FUNCTION notify_blog_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify blog author if someone comments on their blog
  INSERT INTO notifications (user_id, type, actor_id, blog_id, comment_id)
  SELECT b.author_id, 'comment', NEW.user_id, NEW.blog_id, NEW.id
  FROM blogs b
  WHERE b.id = NEW.blog_id
  AND b.author_id != NEW.user_id; -- Don't notify self
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_blog_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_blog_comment();

-- 3. Trigger for new follows
CREATE OR REPLACE FUNCTION notify_new_follow()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify user when someone follows them
  INSERT INTO notifications (user_id, type, actor_id)
  VALUES (NEW.following_id, 'follow', NEW.follower_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_follow
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_follow();

-- 4. Trigger for new blog posts from followed users
CREATE OR REPLACE FUNCTION notify_new_blog()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify when a blog is published (not when created as draft)
  IF NEW.published = true AND (OLD IS NULL OR OLD.published = false) THEN
    -- Notify all followers of the blog author
    INSERT INTO notifications (user_id, type, actor_id, blog_id)
    SELECT f.follower_id, 'new_blog', NEW.author_id, NEW.id
    FROM follows f
    WHERE f.following_id = NEW.author_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_blog_published
  AFTER INSERT OR UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_blog();

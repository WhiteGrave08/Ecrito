# Supabase Migration Instructions

## Migration Status

✅ **003_bookmarks.sql** - Already applied
✅ **004_comments.sql** - Already applied
❌ **005_notifications.sql** - Needs to be applied

---

## Apply Notifications Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/005_notifications.sql`
6. Paste into the SQL Editor
7. Click **Run** button
8. Verify success message

### Option 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd c:\Users\Mary DOLO\Desktop\ecrito

# Run the migration
supabase db push
```

## Verify Migration

After running the migration, verify everything was created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new `notifications` table
3. Check that it has these columns:

   - id (uuid)
   - user_id (uuid)
   - type (text)
   - actor_id (uuid, nullable)
   - blog_id (uuid, nullable)
   - comment_id (uuid, nullable)
   - read (boolean)
   - created_at (timestamp)

4. Go to **Database** → **Functions** to verify triggers were created:
   - `notify_blog_like()`
   - `notify_blog_comment()`
   - `notify_new_follow()`
   - `notify_new_blog()`

## Test the Features

### Test Notifications

**Setup:**

- You'll need two accounts to test properly
- Account A = Actor (performs actions)
- Account B = Receiver (gets notifications)

**Test Like Notification:**

1. Login as Account A
2. Like a blog post created by Account B
3. Login as Account B
4. Click the bell icon in the header
5. You should see a notification: "Account A liked your blog..."

**Test Comment Notification:**

1. Login as Account A
2. Comment on a blog post created by Account B
3. Login as Account B
4. Check notifications - should see comment notification

**Test Follow Notification:**

1. Login as Account A
2. Follow Account B
3. Login as Account B
4. Check notifications - should see follow notification

**Test New Blog Notification:**

1. Login as Account A
2. Follow Account B (if not already)
3. Login as Account B
4. Publish a new blog post
5. Login as Account A
6. Check notifications - should see new blog notification

**Test Mark as Read:**

1. Click on any unread notification (has blue dot)
2. The notification should be marked as read
3. Unread count badge should decrease

**Test Mark All as Read:**

1. Have multiple unread notifications
2. Click "Mark all as read" button
3. All notifications should be marked as read
4. Badge should disappear

### Test Previous Features

**Test Comments:**

1. Open any blog post
2. Write a comment and click "Comment"
3. Your comment should appear immediately
4. Try editing and deleting your own comments
5. Try replying to a comment

**Test Bookmarks:**

1. Open any blog post
2. Click the **Save** button
3. Go to your profile → **Saved** tab
4. You should see your bookmarked blog

**Test Discover Filters:**

1. Go to the Discover page
2. Click **Following** - shows only blogs from followed users
3. Click **Popular** - shows blogs sorted by likes
4. Click **All Posts** - shows all published blogs

---

## Notification Bell Features

- **Real-time unread count** - Badge shows number of unread notifications
- **Auto-refresh** - Checks for new notifications every 30 seconds
- **Dropdown menu** - Click bell to see all notifications
- **Mark as read** - Click notification to mark as read
- **Mark all as read** - Button to mark all notifications as read
- **Delete notifications** - Hover over notification to see delete button

---

**Note:** If you encounter any errors during migration, check the Supabase logs for details.

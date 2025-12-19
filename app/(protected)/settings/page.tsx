'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { uploadBlogImage } from '@/app/actions/blog-actions';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username || '');
        setFullName(profile.full_name || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadBlogImage(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        setAvatarUrl(result.url!);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
        // Hard refresh to clear all caches
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account settings and preferences</p>
        </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            {/* Avatar */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Profile Picture</Label>
              <div className="flex items-center gap-6">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold border-2 border-primary">
                    {fullName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <Label htmlFor="email" className="text-lg font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="mt-2 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-lg font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  // Remove spaces and special characters, allow only letters, numbers, hyphens, underscores
                  const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                  setUsername(sanitized);
                }}
                className="mt-2"
                placeholder="your-username"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only lowercase letters, numbers, hyphens, and underscores allowed
              </p>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-lg font-semibold">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2"
                placeholder="John Doe"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-lg font-semibold">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {bio.length}/500 characters
              </p>
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password</p>
              </div>
              <Button variant="outline" onClick={() => toast.info('Password change feature coming soon!')}>
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
              <div>
                <h3 className="font-semibold text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={() => toast.info('Account deletion feature coming soon!')}>
                Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="btn-gradient"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}

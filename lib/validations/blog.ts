import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt is too long').optional(),
  coverImageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
  published: z.boolean().default(false),
});

export type BlogFormData = z.infer<typeof blogSchema>;

export const blogUpdateSchema = blogSchema.partial().extend({
  id: z.string().uuid(),
});

export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;

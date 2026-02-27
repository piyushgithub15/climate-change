import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createPost, getAllPosts, getPostById, deletePost, NewPost } from '../db/database';
import { uploadToCloudinary, isCloudinaryConfigured } from '../media/uploader';
import { checkRateLimit } from '../instagram/api';

const router = Router();

const upload = multer({
  dest: path.resolve(__dirname, '..', '..', 'uploads'),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get('/posts', async (_req: Request, res: Response) => {
  const posts = await getAllPosts();
  res.json(posts);
});

router.get('/posts/:id', async (req: Request, res: Response) => {
  const post = await getPostById(Number(req.params.id));
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json(post);
});

router.post('/posts', async (req: Request, res: Response) => {
  const { type, caption, media_urls, scheduled_at } = req.body;

  if (!type || !['image', 'carousel', 'reel'].includes(type)) {
    res.status(400).json({ error: 'type must be "image", "carousel", or "reel"' });
    return;
  }
  if (!media_urls || !Array.isArray(media_urls) || media_urls.length === 0) {
    res.status(400).json({ error: 'media_urls must be a non-empty array of URLs' });
    return;
  }
  if (!scheduled_at) {
    res.status(400).json({ error: 'scheduled_at is required (ISO 8601 format)' });
    return;
  }
  if (type === 'carousel' && media_urls.length < 2) {
    res.status(400).json({ error: 'Carousel requires at least 2 media URLs' });
    return;
  }
  if (type === 'carousel' && media_urls.length > 10) {
    res.status(400).json({ error: 'Carousel supports at most 10 media items' });
    return;
  }

  const newPost: NewPost = {
    type,
    caption: caption || '',
    media_urls: JSON.stringify(media_urls),
    scheduled_at,
  };

  const post = await createPost(newPost);
  res.status(201).json(post);
});

router.delete('/posts/:id', async (req: Request, res: Response) => {
  const deleted = await deletePost(Number(req.params.id));
  if (!deleted) {
    res.status(404).json({ error: 'Post not found or already published' });
    return;
  }
  res.json({ success: true });
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!isCloudinaryConfigured()) {
    res.status(400).json({ error: 'Cloudinary is not configured. Add credentials to .env or provide media URLs directly.' });
    return;
  }
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    const url = await uploadToCloudinary(req.file.path);
    res.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

router.get('/rate-limit', async (_req: Request, res: Response) => {
  try {
    const limit = await checkRateLimit();
    res.json(limit);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;

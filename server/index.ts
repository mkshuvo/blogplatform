import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
  imageUrl: z.string().optional()
});

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Image upload endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Blog post routes
app.post('/api/posts', authenticateToken, async (req: any, res) => {
  try {
    const { title, content, published, imageUrl } = postSchema.parse(req.body);
    const postData = {
      title,
      content,
      published: published ?? false,
      authorId: req.user.userId,
      ...(imageUrl ? { imageUrl } : {})  // Only include imageUrl if it exists
    };
    
    const post = await prisma.post.create({
      data: postData
    });
    res.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.get('/api/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true, email: true } } }
  });
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { author: { select: { name: true, email: true } } }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.get('/api/posts/my', authenticateToken, async (req: any, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.user.userId },
    include: { author: { select: { name: true, email: true } } }
  });
  res.json(posts);
});

app.put('/api/posts/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    const { title, content, published, imageUrl } = postSchema.parse(req.body);
    const postData = {
      title,
      content,
      published,
      ...(imageUrl ? { imageUrl } : {})  // Only include imageUrl if it exists
    };
    
    const post = await prisma.post.update({
      where: { id: Number(id), authorId: req.user.userId },
      data: postData
    });
    res.json(post);
  } catch (error) {
    console.error('Post update error:', error);
    res.status(400).json({ error: 'Invalid input or unauthorized' });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id), authorId: req.user.userId }
    });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input or unauthorized' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
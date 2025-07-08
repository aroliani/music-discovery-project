import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from './config/passport.js';

import User from './models/users.model.js';
import Post from './models/posts.model.js';
import Comment from './models/comments.model.js';

import { isUserValidator, isSameUserValidator } from './validators/post.validator.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect MongoDB
mongoose.connect('mongodb+srv://pythonteam:OG36ibZAQh6DoTSQ@cluster0.yjjpbgv.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// === AUTH ROUTES ===
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful', user: { id: req.user._id, username: req.user.username } });
});

app.get('/auth/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not logged in" });
  res.json({ user: { id: req.user._id, username: req.user.username } });
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// === POSTS ROUTES ===
app.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('userId', 'username');
  res.json(posts);
});

app.get('/posts/:postId', async (req, res) => {
  let post = null;
  if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
    post = await Post.findById(req.params.postId).populate('userId', 'username');
  }
  if (!post) {
    post = await Post.findOne({ id: Number(req.params.postId) }).populate('userId', 'username');
  }
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.post('/posts', isUserValidator, async (req, res) => {
  const { title, body, artist, genre, duration, audioUrl } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

  const lastPost = await Post.findOne().sort({ id: -1 });
  const id = lastPost && lastPost.id ? lastPost.id + 1 : 1;
  const numberId = id;
  const userId = req.user?._id;

  const newPost = new Post({ id, title, body, artist, genre, duration, audioUrl, numberId, userId });
  await newPost.save();
  res.status(201).json({ post: newPost });
});

app.put('/posts/:id', isSameUserValidator, async (req, res) => {
  const { title, body, artist, genre, duration, audioUrl } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

  let post = null;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, artist, genre, duration, audioUrl },
      { new: true }
    );
  }
  if (!post) {
    post = await Post.findOneAndUpdate(
      { id: Number(req.params.id) },
      { title, body, artist, genre, duration },
      { new: true }
    );
  }
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

app.delete('/posts/:id', isSameUserValidator, async (req, res) => {
  let post = null;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    post = await Post.findByIdAndDelete(req.params.id);
  }
  if (!post) {
    post = await Post.findOneAndDelete({ id: Number(req.params.id) });
  }
  if (!post) return res.status(404).json({ error: 'Post not found' });

  await Comment.deleteMany({ postId: post._id });
  await Comment.deleteMany({ postId: post.id });
  res.json({ message: 'Post deleted' });
});

// === COMMENTS ROUTES ===
app.get('/posts/:postId/comments', async (req, res) => {
  let comments = [];
  if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
    comments = await Comment.find({ postId: req.params.postId }).populate('userId', 'username');
  }
  const commentsByNumber = await Comment.find({ postId: Number(req.params.postId) }).populate('userId', 'username');
  comments = comments.concat(commentsByNumber);

  const seen = new Set();
  const uniqueComments = comments.filter(c => {
    if (seen.has(String(c._id))) return false;
    seen.add(String(c._id));
    return true;
  });
  res.json(uniqueComments);
});

app.post('/posts/:postId/comments', async (req, res) => {
  const { name, email, body } = req.body;
  if (!name || !body) return res.status(400).json({ error: 'Name and body are required' });

  let postId = req.params.postId;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    postId = Number(postId);
  }

  const lastComment = await Comment.findOne({ postId }).sort({ numberId: -1 });
  const numberId = lastComment && lastComment.numberId ? lastComment.numberId + 1 : 1;
  const userId = req.user?._id;

  const comment = new Comment({ postId, name, email, body, numberId, userId });
  await comment.save();
  res.status(201).json({ comment });
});

app.delete('/comments/:commentId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }
  const comment = await Comment.findByIdAndDelete(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json({ message: 'Comment deleted' });
});

// === Root ===
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

const express = require('express');
const router = express.Router();
const { getBlogs, createBlog, verifyBlog, deleteBlog } = require('../db');

// GET /api/blogs - Get all blogs
router.get('/', (req, res) => {
  try {
    const blogs = getBlogs();
    return res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

// POST /api/blogs - Create a new blog post (marked as pending/not verified)
router.post('/', (req, res) => {
  try {
    const { title, content, category, author, excerpt, tool, readTime } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const newBlog = createBlog({
      title,
      content,
      category,
      author,
      excerpt,
      tool,
      readTime
    });

    return res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({ success: false, error: 'Failed to post blog' });
  }
});

// PUT /api/blogs/:id/verify - Verify and publish a blog post
router.put('/:id/verify', (req, res) => {
  try {
    const { id } = req.params;
    const blog = verifyBlog(id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    return res.json({ success: true, blog });
  } catch (error) {
    console.error('Error verifying blog:', error);
    return res.status(500).json({ success: false, error: 'Failed to verify blog post' });
  }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteBlog(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
});

module.exports = router;

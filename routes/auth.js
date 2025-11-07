const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // You'll need to create this

// Profile route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;

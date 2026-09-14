const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  removeMember,
  deleteRequestAdmin,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.delete('/members/:userId', protect, adminOnly, removeMember);
router.delete('/requests/:requestId', protect, adminOnly, deleteRequestAdmin);

module.exports = router;

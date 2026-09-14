const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  acknowledgeAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAnnouncement);
router.get('/', protect, getAnnouncements);
router.post('/:id/acknowledge', protect, acknowledgeAnnouncement);

module.exports = router;

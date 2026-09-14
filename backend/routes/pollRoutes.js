const express = require('express');
const router = express.Router();
const {
  createPoll,
  getPolls,
  getPollById,
  votePoll,
  closePoll,
} = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPoll);
router.get('/', protect, getPolls);
router.get('/:id', protect, getPollById);
router.post('/:id/vote', protect, votePoll);
router.patch('/:id/close', protect, closePoll);

module.exports = router;

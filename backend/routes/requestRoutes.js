const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequestById,
  joinRequest,
  leaveRequest,
  addProviderQuote,
  voteProviderQuote,
  addPredefinedComment,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.post('/:id/join', protect, joinRequest);
router.delete('/:id/leave', protect, leaveRequest);
router.post('/:id/quotes', protect, addProviderQuote);
router.post('/:id/quotes/:quoteId/vote', protect, voteProviderQuote);
router.post('/:id/comments', protect, addPredefinedComment);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;

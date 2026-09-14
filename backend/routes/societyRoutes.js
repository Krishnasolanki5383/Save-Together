const express = require('express');
const router = express.Router();
const {
  createSociety,
  joinSociety,
  getSocietyDetails,
  getSocietyMembers,
  regenerateQR,
} = require('../controllers/societyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSociety);
router.post('/join', protect, joinSociety);
router.get('/:id', protect, getSocietyDetails);
router.get('/:id/members', protect, getSocietyMembers);
router.post('/:id/regenerate-qr', protect, regenerateQR);

module.exports = router;

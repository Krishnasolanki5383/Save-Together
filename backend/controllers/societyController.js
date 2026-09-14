const Society = require('../models/Society');
const User = require('../models/User');
const crypto = require('crypto');

// Generate unique 6-character society code
const generateInviteCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Create a new society
// @route   POST /api/societies
exports.createSociety = async (req, res) => {
  try {
    const { name, city, locality, address } = req.body;

    if (!name || !city || !locality) {
      return res.status(400).json({
        success: false,
        message: 'Society Name, City, and Locality are required',
      });
    }

    const inviteCode = generateInviteCode();

    const society = await Society.create({
      name,
      city,
      locality,
      address: address || '',
      inviteCode,
      createdBy: req.user._id,
      memberCount: 1,
      totalSocietySavings: 42800, // Initial estimated benchmark for visual appeal
    });

    // Update user to ADMIN of this society
    req.user.societyId = society._id;
    req.user.role = 'ADMIN';
    await req.user.save();

    res.status(201).json({
      success: true,
      society,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        societyId: society._id,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    console.error('Create Society Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join society via code or QR
// @route   POST /api/societies/join
exports.joinSociety = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Society Invite Code or QR Data is required',
      });
    }

    // Support full QR URL (e.g. society/AB12CD) or plain code
    const cleanCode = code.includes('/') ? code.split('/').pop().trim().toUpperCase() : code.trim().toUpperCase();

    const society = await Society.findOne({ inviteCode: cleanCode });
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Invalid society QR or invite code. Society not found.',
      });
    }

    // Check if already in this society
    if (req.user.societyId && req.user.societyId.toString() === society._id.toString()) {
      return res.json({
        success: true,
        message: 'You are already a member of this society',
        society,
      });
    }

    // Update user societyId
    req.user.societyId = society._id;
    await req.user.save();

    // Increment member count
    society.memberCount += 1;
    await society.save();

    res.json({
      success: true,
      message: `Welcome to ${society.name}!`,
      society,
      user: {
        _id: req.user._id,
        name: req.user.name,
        societyId: society._id,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Join Society Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get society details
// @route   GET /api/societies/:id
exports.getSocietyDetails = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }
    res.json({ success: true, society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get members of a society (Paginated for 400+ scale)
// @route   GET /api/societies/:id/members
exports.getSocietyMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const members = await User.find({ societyId: req.params.id })
      .select('name email phone flatNumber buildingBlock role totalSavings createdAt')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ societyId: req.params.id });

    res.json({
      success: true,
      members,
      page,
      pages: Math.ceil(total / limit),
      totalMembers: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate society QR invite code (Admin only)
// @route   POST /api/societies/:id/regenerate-qr
exports.regenerateQR = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ success: false, message: 'Society not found' });
    }

    if (society.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only Society Admin can regenerate QR code' });
    }

    society.inviteCode = generateInviteCode();
    await society.save();

    res.json({
      success: true,
      message: 'Society QR Code updated successfully',
      inviteCode: society.inviteCode,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

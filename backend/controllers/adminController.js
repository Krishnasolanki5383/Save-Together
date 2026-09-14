const User = require('../models/User');
const Society = require('../models/Society');
const Request = require('../models/Request');
const Poll = require('../models/Poll');

// @desc    Get Society Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const societyId = req.user.societyId;

    const society = await Society.findById(societyId);
    const memberCount = await User.countDocuments({ societyId });
    const activeRequestsCount = await Request.countDocuments({ societyId, status: { $ne: 'COMPLETED' } });
    const completedDealsCount = await Request.countDocuments({ societyId, status: 'COMPLETED' });
    const activePollsCount = await Poll.countDocuments({ societyId, status: 'OPEN' });

    res.json({
      success: true,
      stats: {
        societyName: society ? society.name : 'Society',
        inviteCode: society ? society.inviteCode : '',
        memberCount,
        activeRequestsCount,
        completedDealsCount,
        activePollsCount,
        totalSocietySavings: society ? society.totalSocietySavings : 42800,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from society (Admin only)
// @route   DELETE /api/admin/members/:userId
exports.removeMember = async (req, res) => {
  try {
    const userToRemove = await User.findById(req.params.userId);

    if (!userToRemove) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (userToRemove.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(403).json({ success: false, message: 'User is not in your society' });
    }

    userToRemove.societyId = null;
    userToRemove.role = 'MEMBER';
    await userToRemove.save();

    // Decrement society member count
    await Society.findByIdAndUpdate(req.user.societyId, { $inc: { memberCount: -1 } });

    res.json({ success: true, message: `Removed ${userToRemove.name} from society` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Moderate Request (Admin only)
// @route   DELETE /api/admin/requests/:requestId
exports.deleteRequestAdmin = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Request.findByIdAndDelete(req.params.requestId);
    res.json({ success: true, message: 'Request removed by Admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

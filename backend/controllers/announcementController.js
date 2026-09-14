const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create Announcement (Admin only or verified creator)
// @route   POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, eventDate, eventTime, location } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      societyId: req.user.societyId,
      createdBy: req.user._id,
      createdByName: req.user.name,
      title,
      content,
      eventDate: eventDate || '',
      eventTime: eventTime || '',
      location: location || 'Society premises',
    });

    // Notify all society members
    const members = await User.find({
      societyId: req.user.societyId,
      _id: { $ne: req.user._id },
    }).select('_id');

    const notificationDocs = members.map((m) => ({
      userId: m._id,
      societyId: req.user.societyId,
      type: 'SOCIETY',
      title: '📢 Society Announcement',
      body: `${title}: ${content.substring(0, 80)}...`,
      relatedId: announcement._id,
    }));

    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
    }

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Announcements for society
// @route   GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ societyId: req.user.societyId }).sort({ createdAt: -1 });
    res.json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Acknowledge Announcement
// @route   POST /api/announcements/:id/acknowledge
exports.acknowledgeAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    if (!announcement.acknowledgements.includes(req.user._id)) {
      announcement.acknowledgements.push(req.user._id);
      announcement.ackCount = announcement.acknowledgements.length;
      await announcement.save();
    }

    res.json({ success: true, message: 'Announcement acknowledged', announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

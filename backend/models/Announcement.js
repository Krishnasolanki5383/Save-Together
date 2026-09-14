const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    eventDate: {
      type: String,
      default: '',
    },
    eventTime: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Society premises',
    },
    acknowledgements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    ackCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'SCHEDULED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);

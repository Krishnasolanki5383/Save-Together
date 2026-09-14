const mongoose = require('mongoose');

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    totalSocietySavings: {
      type: Number,
      default: 0,
    },
    activeDealsCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Society', societySchema);

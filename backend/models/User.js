const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email or Phone is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      default: '',
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat/Apartment number is required'],
    },
    buildingBlock: {
      type: String,
      default: '',
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: ['MEMBER', 'ADMIN'],
      default: 'MEMBER',
    },
    totalSavings: {
      type: Number,
      default: 0,
    },
    joinedActivitiesCount: {
      type: Number,
      default: 0,
    },
    createdRequestsCount: {
      type: Number,
      default: 0,
    },
    completedDealsCount: {
      type: Number,
      default: 0,
    },
    expoPushToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

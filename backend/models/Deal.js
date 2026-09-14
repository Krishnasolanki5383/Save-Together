const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    individualPrice: {
      type: Number,
      required: true,
    },
    groupPrice: {
      type: Number,
      required: true,
    },
    savingsPerPerson: {
      type: Number,
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participantCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['BOOKING_OPEN', 'CONFIRMED', 'COMPLETED'],
      default: 'BOOKING_OPEN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);

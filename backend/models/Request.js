const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  providerName: { type: String, required: true },
  pricePerPerson: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  notes: { type: String, default: '' },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  flatNumber: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

const structuredCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  flatNumber: { type: String, required: true },
  presetText: {
    type: String,
    required: true,
    enum: [
      'I need this service urgently',
      'Saturday morning works best for me',
      'Saturday evening works best for me',
      'Sunday morning works best for me',
      'Sunday evening works best for me',
      'I have contacted a local technician option',
      'Please request provider quote',
      'Count me in for group booking',
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

const requestSchema = new mongoose.Schema(
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
    createdByFlat: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'AC Service',
        'Appliance Repair',
        'Plumbing',
        'Electrical',
        'Carpenter',
        'Cleaning',
        'Pest Control',
        'Internet',
        'Moving',
        'Home Painting',
        'Water Purifier',
        'RO Service',
        'CCTV',
        'Security',
        'Other',
      ],
      default: 'Other',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    targetMembers: {
      type: Number,
      default: 10,
    },
    participantCount: {
      type: Number,
      default: 1,
    },
    participants: [participantSchema],
    preferredDate: {
      type: String,
      default: 'This Weekend',
    },
    preferredTime: {
      type: String,
      default: 'Morning (10 AM - 1 PM)',
    },
    estimatedIndividualPrice: {
      type: Number,
      required: true,
      default: 800,
    },
    estimatedGroupPrice: {
      type: Number,
      required: true,
      default: 550,
    },
    finalPrice: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'OPEN',
        'COLLECTING_MEMBERS',
        'TARGET_REACHED',
        'QUOTE_REQUESTED',
        'DEAL_CONFIRMED',
        'SERVICE_SCHEDULED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'COLLECTING_MEMBERS',
    },
    quotes: [quoteSchema],
    selectedProvider: {
      type: String,
      default: null,
    },
    structuredComments: [structuredCommentSchema],
    isHighDemand: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);

const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new Service Request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      targetMembers,
      preferredDate,
      preferredTime,
      estimatedIndividualPrice,
      estimatedGroupPrice,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and Description are required',
      });
    }

    const newRequest = await Request.create({
      societyId: req.user.societyId,
      createdBy: req.user._id,
      createdByName: req.user.name,
      createdByFlat: `${req.user.buildingBlock ? req.user.buildingBlock + '-' : ''}${req.user.flatNumber}`,
      title,
      category: category || 'Other',
      description,
      targetMembers: Number(targetMembers) || 10,
      participantCount: 1,
      participants: [
        {
          userId: req.user._id,
          name: req.user.name,
          flatNumber: req.user.flatNumber,
        },
      ],
      preferredDate: preferredDate || 'This Weekend',
      preferredTime: preferredTime || 'Morning (10 AM - 1 PM)',
      estimatedIndividualPrice: Number(estimatedIndividualPrice) || 800,
      estimatedGroupPrice: Number(estimatedGroupPrice) || 550,
      status: 'COLLECTING_MEMBERS',
      isHighDemand: Number(targetMembers) >= 15,
    });

    // Increment user created counter
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { createdRequestsCount: 1, joinedActivitiesCount: 1 },
    });

    // Create Notification for Society Members
    const members = await User.find({
      societyId: req.user.societyId,
      _id: { $ne: req.user._id },
    }).select('_id');

    const notificationDocs = members.map((m) => ({
      userId: m._id,
      societyId: req.user.societyId,
      type: 'REQUEST',
      title: 'New Service Request',
      body: `${req.user.name} created "${title}" in ${category}. Join to get a bulk discount!`,
      relatedId: newRequest._id,
    }));

    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
    }

    res.status(201).json({
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests for current user society (Filterable & Paginated)
// @route   GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    const { category, status, search, highDemand } = req.query;

    const filter = { societyId: req.user.societyId };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (highDemand === 'true') {
      filter.isHighDemand = true;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Request details
// @route   GET /api/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify society access isolation
    if (request.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to other society data' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a service request
// @route   POST /api/requests/:id/join
exports.joinRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if user already joined
    const alreadyJoined = request.participants.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You are already participating in this request' });
    }

    // Add user to participants
    request.participants.push({
      userId: req.user._id,
      name: req.user.name,
      flatNumber: req.user.flatNumber,
    });

    request.participantCount = request.participants.length;

    // Check if target is reached
    if (request.participantCount >= request.targetMembers && request.status === 'COLLECTING_MEMBERS') {
      request.status = 'TARGET_REACHED';

      // Notify Request Creator & Participants
      await Notification.create({
        userId: request.createdBy,
        societyId: request.societyId,
        type: 'REQUEST',
        title: '🎉 Target Reached!',
        body: `Your request "${request.title}" reached its target of ${request.targetMembers} residents! You can now request provider quotes.`,
        relatedId: request._id,
      });
    }

    await request.save();

    // Increment user joined counter
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { joinedActivitiesCount: 1 },
    });

    // Notify Creator about new participant
    if (request.createdBy.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: request.createdBy,
        societyId: request.societyId,
        type: 'REQUEST',
        title: 'New Participant Joined',
        body: `${req.user.name} (Flat ${req.user.flatNumber}) joined your request "${request.title}". (${request.participantCount}/${request.targetMembers})`,
        relatedId: request._id,
      });
    }

    res.json({
      success: true,
      message: "You're in! We'll notify you when the group reaches its target.",
      request,
    });
  } catch (error) {
    console.error('Join Request Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Leave a service request
// @route   DELETE /api/requests/:id/leave
exports.leaveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Filter out user
    request.participants = request.participants.filter(
      (p) => p.userId.toString() !== req.user._id.toString()
    );

    request.participantCount = request.participants.length;

    if (request.participantCount < request.targetMembers && request.status === 'TARGET_REACHED') {
      request.status = 'COLLECTING_MEMBERS';
    }

    await request.save();

    res.json({
      success: true,
      message: 'You have left the request.',
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add provider quote option (Creator or Admin)
// @route   POST /api/requests/:id/quotes
exports.addProviderQuote = async (req, res) => {
  try {
    const { providerName, pricePerPerson, rating, notes } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.quotes.push({
      providerName,
      pricePerPerson: Number(pricePerPerson),
      rating: Number(rating) || 4.5,
      notes: notes || '',
      votes: [],
    });

    request.status = 'QUOTE_REQUESTED';
    await request.save();

    res.json({ success: true, message: 'Provider quote added successfully', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Vote for provider quote
// @route   POST /api/requests/:id/quotes/:quoteId/vote
exports.voteProviderQuote = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    const quote = request.quotes.id(req.params.quoteId);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

    // Remove user vote from all quotes in this request first
    request.quotes.forEach((q) => {
      q.votes = q.votes.filter((v) => v.toString() !== req.user._id.toString());
    });

    // Add vote to chosen quote
    quote.votes.push(req.user._id);

    await request.save();

    res.json({ success: true, message: 'Vote recorded for provider quote', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add predefined quick response comment
// @route   POST /api/requests/:id/comments
exports.addPredefinedComment = async (req, res) => {
  try {
    const { presetText } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.structuredComments.push({
      userId: req.user._id,
      userName: req.user.name,
      flatNumber: req.user.flatNumber,
      presetText,
    });

    await request.save();

    res.json({ success: true, message: 'Response added', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Request Lifecycle Status
// @route   PATCH /api/requests/:id/status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, finalPrice, selectedProvider } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.status = status;
    if (finalPrice) request.finalPrice = Number(finalPrice);
    if (selectedProvider) request.selectedProvider = selectedProvider;

    // If COMPLETED, calculate savings and update user & society totals
    if (status === 'COMPLETED') {
      const perUserSavings = request.estimatedIndividualPrice - (request.finalPrice || request.estimatedGroupPrice);
      const totalSavingsForGroup = perUserSavings * request.participantCount;

      // Update all participants' savings
      const participantUserIds = request.participants.map((p) => p.userId);
      await User.updateMany(
        { _id: { $in: participantUserIds } },
        { $inc: { totalSavings: perUserSavings > 0 ? perUserSavings : 250, completedDealsCount: 1 } }
      );
    }

    await request.save();

    res.json({ success: true, message: `Request status updated to ${status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

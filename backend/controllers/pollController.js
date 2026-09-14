const Poll = require('../models/Poll');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a Poll
// @route   POST /api/polls
exports.createPoll = async (req, res) => {
  try {
    const { question, options, requestId } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Question and at least 2 options are required for a poll',
      });
    }

    const formattedOptions = options.map((optText) => ({
      text: optText,
      votes: [],
      voteCount: 0,
    }));

    const poll = await Poll.create({
      societyId: req.user.societyId,
      createdBy: req.user._id,
      createdByName: req.user.name,
      requestId: requestId || null,
      question,
      options: formattedOptions,
    });

    // Notify society members
    const members = await User.find({
      societyId: req.user.societyId,
      _id: { $ne: req.user._id },
    }).select('_id');

    const notificationDocs = members.map((m) => ({
      userId: m._id,
      societyId: req.user.societyId,
      type: 'POLL',
      title: 'New Society Poll',
      body: `Cast your vote on: "${question}"`,
      relatedId: poll._id,
    }));

    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
    }

    res.status(201).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Polls for user society
// @route   GET /api/polls
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ societyId: req.user.societyId }).sort({ createdAt: -1 });
    res.json({ success: true, count: polls.length, polls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Poll details
// @route   GET /api/polls/:id
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });
    res.json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Vote in a Poll
// @route   POST /api/polls/:id/vote
exports.votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    if (poll.status === 'CLOSED') {
      return res.status(400).json({ success: false, message: 'This poll is closed for voting.' });
    }

    // Check if user already voted
    const alreadyVoted = poll.voterIds.some((vId) => vId.toString() === req.user._id.toString());
    if (alreadyVoted) {
      return res.status(400).json({ success: false, message: 'You have already voted in this poll.' });
    }

    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ success: false, message: 'Option not found' });

    option.votes.push(req.user._id);
    option.voteCount = option.votes.length;

    poll.voterIds.push(req.user._id);
    poll.totalVotes = poll.voterIds.length;

    await poll.save();

    res.json({ success: true, message: 'Vote submitted successfully', poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close Poll & Announce Winner
// @route   PATCH /api/polls/:id/close
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    poll.status = 'CLOSED';

    // Calculate highest voted option
    let winner = poll.options[0];
    poll.options.forEach((opt) => {
      if (opt.voteCount > winner.voteCount) {
        winner = opt;
      }
    });

    poll.winningOption = winner ? winner.text : 'No votes cast';
    await poll.save();

    res.json({ success: true, message: 'Poll closed', winningOption: poll.winningOption, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const requireSociety = (req, res, next) => {
  if (!req.user || !req.user.societyId) {
    return res.status(400).json({
      success: false,
      message: 'You must belong to a housing society to perform this action.',
    });
  }
  req.societyId = req.user.societyId;
  next();
};

module.exports = { requireSociety };

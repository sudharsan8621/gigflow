const asyncHandler = require('express-async-handler');
const Gig = require('../models/Gig');
const Bid = require('../models/Bid');

const getGigs = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  let query = {};

  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: 'i' };

  const gigs = await Gig.find(query)
    .populate('ownerId', 'name email')
    .populate('hiredFreelancerId', 'name email')
    .sort({ createdAt: -1 });

  const gigsWithBidCount = await Promise.all(
    gigs.map(async (gig) => {
      const bidCount = await Bid.countDocuments({ gigId: gig._id });
      return { ...gig.toObject(), bidCount };
    })
  );

  res.status(200).json({ success: true, count: gigs.length, gigs: gigsWithBidCount });
});

const getGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id)
    .populate('ownerId', 'name email')
    .populate('hiredFreelancerId', 'name email');

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  const bidCount = await Bid.countDocuments({ gigId: gig._id });
  res.status(200).json({ success: true, gig: { ...gig.toObject(), bidCount } });
});

const createGig = asyncHandler(async (req, res) => {
  const { title, description, budget } = req.body;

  const gig = await Gig.create({ title, description, budget, ownerId: req.user._id });
  const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

  res.status(201).json({ success: true, gig: { ...populatedGig.toObject(), bidCount: 0 } });
});

const updateGig = asyncHandler(async (req, res) => {
  let gig = await Gig.findById(req.params.id);

  if (!gig) { res.status(404); throw new Error('Gig not found'); }
  if (gig.ownerId.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  if (gig.status === 'assigned') { res.status(400); throw new Error('Cannot update assigned gig'); }

  const { title, description, budget } = req.body;
  gig = await Gig.findByIdAndUpdate(req.params.id, { title, description, budget }, { new: true, runValidators: true }).populate('ownerId', 'name email');

  res.status(200).json({ success: true, gig });
});

const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) { res.status(404); throw new Error('Gig not found'); }
  if (gig.ownerId.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  if (gig.status === 'assigned') { res.status(400); throw new Error('Cannot delete assigned gig'); }

  await Bid.deleteMany({ gigId: gig._id });
  await gig.deleteOne();

  res.status(200).json({ success: true, message: 'Gig deleted successfully' });
});

const getMyGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({ ownerId: req.user._id })
    .populate('ownerId', 'name email')
    .populate('hiredFreelancerId', 'name email')
    .sort({ createdAt: -1 });

  const gigsWithBidCount = await Promise.all(
    gigs.map(async (gig) => {
      const bidCount = await Bid.countDocuments({ gigId: gig._id });
      return { ...gig.toObject(), bidCount };
    })
  );

  res.status(200).json({ success: true, count: gigs.length, gigs: gigsWithBidCount });
});

module.exports = { getGigs, getGig, createGig, updateGig, deleteGig, getMyGigs };
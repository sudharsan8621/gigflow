const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { sendNotification } = require('../utils/socket');

const createBid = asyncHandler(async (req, res) => {
  const { gigId, message, price } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) { res.status(404); throw new Error('Gig not found'); }
  if (gig.status !== 'open') { res.status(400); throw new Error('Gig is not accepting bids'); }
  if (gig.ownerId.toString() === req.user._id.toString()) { res.status(400); throw new Error('Cannot bid on your own gig'); }

  const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
  if (existingBid) { res.status(400); throw new Error('You already submitted a bid'); }

  const bid = await Bid.create({ gigId, freelancerId: req.user._id, message, price });
  const populatedBid = await Bid.findById(bid._id).populate('freelancerId', 'name email').populate('gigId', 'title');

  sendNotification(gig.ownerId.toString(), 'new-bid', { message: `New bid on "${gig.title}"`, bid: populatedBid });

  res.status(201).json({ success: true, bid: populatedBid });
});

const getBidsForGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) { res.status(404); throw new Error('Gig not found'); }
  if (gig.ownerId.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only gig owner can view bids'); }

  const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bids.length, bids });
});

const getMyBids = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ freelancerId: req.user._id })
    .populate({ path: 'gigId', select: 'title description budget status ownerId', populate: { path: 'ownerId', select: 'name email' } })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bids.length, bids });
});

const hireBid = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bid = await Bid.findById(req.params.bidId).populate('freelancerId', 'name email').session(session);
    if (!bid) { await session.abortTransaction(); res.status(404); throw new Error('Bid not found'); }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) { await session.abortTransaction(); res.status(404); throw new Error('Gig not found'); }
    if (gig.ownerId.toString() !== req.user._id.toString()) { await session.abortTransaction(); res.status(403); throw new Error('Only gig owner can hire'); }
    if (gig.status !== 'open') { await session.abortTransaction(); res.status(400); throw new Error('Gig already assigned'); }
    if (bid.status !== 'pending') { await session.abortTransaction(); res.status(400); throw new Error('Bid not available'); }

    const updatedGig = await Gig.findOneAndUpdate(
      { _id: gig._id, status: 'open' },
      { status: 'assigned', hiredBidId: bid._id, hiredFreelancerId: bid.freelancerId._id },
      { new: true, session, runValidators: true }
    ).populate('ownerId', 'name email').populate('hiredFreelancerId', 'name email');

    if (!updatedGig) { await session.abortTransaction(); res.status(400); throw new Error('Failed to assign gig'); }

    await Bid.findByIdAndUpdate(bid._id, { status: 'hired' }, { session });
    const rejectedBids = await Bid.updateMany({ gigId: gig._id, _id: { $ne: bid._id } }, { status: 'rejected' }, { session });

    await session.commitTransaction();

    const allBids = await Bid.find({ gigId: gig._id, _id: { $ne: bid._id } }).select('freelancerId');

    sendNotification(bid.freelancerId._id.toString(), 'hired', { message: `Congratulations! You have been hired for "${gig.title}"!`, gig: updatedGig });
    allBids.forEach((rejectedBid) => {
      sendNotification(rejectedBid.freelancerId.toString(), 'bid-rejected', { message: `Your bid for "${gig.title}" was not selected.`, gigId: gig._id });
    });

    res.status(200).json({ success: true, message: 'Freelancer hired successfully', gig: updatedGig, hiredBid: { ...bid.toObject(), status: 'hired' }, rejectedCount: rejectedBids.modifiedCount });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = { createBid, getBidsForGig, getMyBids, hireBid };
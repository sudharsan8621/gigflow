const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [1, 'Budget must be at least $1'],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open',
  },
  hiredBidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    default: null,
  },
  hiredFreelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ status: 1 });
gigSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Gig', gigSchema);
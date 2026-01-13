const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide your bid price'],
    min: [1, 'Price must be at least $1'],
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
bidSchema.index({ gigId: 1 });
bidSchema.index({ freelancerId: 1 });

module.exports = mongoose.model('Bid', bidSchema);
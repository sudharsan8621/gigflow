const express = require('express');
const router = express.Router();
const { getGigs, getGig, createGig, updateGig, deleteGig, getMyGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getGigs);
router.get('/:id', getGig);

// Protected routes
router.get('/user/my-gigs', protect, getMyGigs);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);

module.exports = router;
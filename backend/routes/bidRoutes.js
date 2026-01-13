const express = require('express');
const router = express.Router();
const { createBid, getBidsForGig, getMyBids, hireBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createBid);
router.get('/my-bids', getMyBids);
router.get('/:gigId', getBidsForGig);
router.patch('/:bidId/hire', hireBid);

module.exports = router;
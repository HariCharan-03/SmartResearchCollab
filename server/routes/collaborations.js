const express = require('express');
const router = express.Router();
const { sendRequest, getRequestsForIdea, respondToRequest, getMyRequests, getIncomingRequests } = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, sendRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/incoming-requests', protect, getIncomingRequests);
router.get('/project/:ideaId', protect, getRequestsForIdea);
router.put('/:requestId', protect, respondToRequest);

module.exports = router;

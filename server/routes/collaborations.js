const express = require('express');
const router = express.Router();
const { sendRequest, getRequestsForIdea, respondToRequest } = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, sendRequest);
router.get('/project/:ideaId', protect, getRequestsForIdea);
router.put('/:requestId', protect, respondToRequest);

module.exports = router;

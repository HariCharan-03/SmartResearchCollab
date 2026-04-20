const express = require('express');
const router = express.Router();
const { postUpdate, getUpdatesForProject } = require('../controllers/updateController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, postUpdate);
router.get('/project/:projectId', protect, getUpdatesForProject);

module.exports = router;

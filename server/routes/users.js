const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/')
  .get(protect, authorizeRoles('Admin'), getAllUsers);

router.route('/:id')
  .delete(protect, authorizeRoles('Admin'), deleteUser);

module.exports = router;

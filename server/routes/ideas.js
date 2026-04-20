const express = require('express');
const router = express.Router();
const { createIdea, getAllIdeas, getIdeaById, updateIdea, deleteIdea } = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createIdea)
  .get(getAllIdeas); // public to browse

router.route('/:id')
  .get(getIdeaById)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

module.exports = router;

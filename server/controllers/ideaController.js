const Idea = require('../models/Idea');

exports.createIdea = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const idea = await Idea.create({
      title,
      description,
      tags,
      createdBy: req.user.id,
      teamMembers: [{ userId: req.user.id, role: 'Creator' }]
    });
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({}).populate('createdBy', 'name email');
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('teamMembers.userId', 'name role skills');
    if (idea) res.json(idea);
    else res.status(404).json({ message: 'Idea not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    
    // Allow update if admin or creator
    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this idea' });
    }

    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.tags = req.body.tags || idea.tags;
    idea.status = req.body.status || idea.status;

    const updatedIdea = await idea.save();
    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this idea' });
    }

    await idea.deleteOne();
    res.json({ message: 'Idea removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

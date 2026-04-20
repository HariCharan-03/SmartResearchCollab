const Update = require('../models/Update');
const Idea = require('../models/Idea');

exports.postUpdate = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const idea = await Idea.findById(projectId);
    if (!idea) return res.status(404).json({ message: 'Project not found' });

    // Check if user is member or mentor or admin
    const isMember = idea.teamMembers.some(m => m.userId.toString() === req.user.id);
    if (!isMember && req.user.role !== 'Mentor' && req.user.role !== 'Admin' && idea.createdBy.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Only team members and mentors can post updates' });
    }

    const update = await Update.create({
      projectId,
      userId: req.user.id,
      message
    });

    // Populate user details for immediate response rendering
    await update.populate('userId', 'name role');

    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUpdatesForProject = async (req, res) => {
  try {
    const updates = await Update.find({ projectId: req.params.projectId })
                                .populate('userId', 'name role')
                                .sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

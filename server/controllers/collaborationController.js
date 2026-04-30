const CollaborationRequest = require('../models/CollaborationRequest');
const Idea = require('../models/Idea');

exports.sendRequest = async (req, res) => {
  try {
    const { ideaId, message } = req.body;
    
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Check if already requested or member
    const existingReq = await CollaborationRequest.findOne({ ideaId, userId: req.user.id });
    if (existingReq) return res.status(400).json({ message: 'Request already sent' });

    const request = await CollaborationRequest.create({
      ideaId,
      userId: req.user.id,
      message
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequestsForIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Mentor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const requests = await CollaborationRequest.find({ ideaId: req.params.ideaId }).populate('userId', 'name email skills role');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const request = await CollaborationRequest.findById(req.params.requestId);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const idea = await Idea.findById(request.ideaId);
    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Mentor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'Approved') {
      // add to team members
      idea.teamMembers.push({ userId: request.userId, role: 'Member' });
      await idea.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

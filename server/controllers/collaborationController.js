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
    const { status, responseMessage } = req.body; // Approved or Rejected, plus optional message
    const request = await CollaborationRequest.findById(req.params.requestId);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const idea = await Idea.findById(request.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Mentors have global access to approve/reject any request.
    // Admins can also act on all requests.
    // Project Creators can only manage requests for their own projects.
    const isMentorOrAdmin = req.user.role === 'Mentor' || req.user.role === 'Admin';
    const isCreator = idea.createdBy.toString() === req.user.id;
    if (!isMentorOrAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    if (responseMessage) {
      request.responseMessage = responseMessage;
    }
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

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ userId: req.user.id })
      .populate('ideaId', 'title status');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    let query = { status: 'Pending' };

    // If Mentor, they see all pending requests globally.
    // If Project Creator, they only see requests for ideas they created.
    if (req.user.role !== 'Mentor' && req.user.role !== 'Admin') {
      const myIdeas = await Idea.find({ createdBy: req.user.id });
      const ideaIds = myIdeas.map(idea => idea._id);
      query.ideaId = { $in: ideaIds };
    }

    const requests = await CollaborationRequest.find(query)
      .populate('userId', 'name email role skills')
      .populate('ideaId', 'title');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require('mongoose');

const CollaborationRequestSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  requestedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CollaborationRequest', CollaborationRequestSchema);

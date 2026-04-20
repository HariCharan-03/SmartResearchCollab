const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamMembers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Member' }
  }],
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Completed'], 
    default: 'Open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Idea', IdeaSchema);

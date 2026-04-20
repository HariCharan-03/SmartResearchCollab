const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['Todo', 'In Progress', 'Done'], 
    default: 'Todo' 
  },
  deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

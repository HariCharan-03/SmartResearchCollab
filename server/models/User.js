const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { 
    type: String, 
    enum: ['Student', 'Project Creator', 'Mentor', 'Admin'], 
    default: 'Student' 
  },
  skills: [{ type: String }],
  interests: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env
dotenv.config();

// Models
const User = require('./models/User');
const Idea = require('./models/Idea');
const Task = require('./models/Task');
const CollaborationRequest = require('./models/CollaborationRequest');
const Update = require('./models/Update');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear everything
    await User.deleteMany();
    await Idea.deleteMany();
    await Task.deleteMany();
    await CollaborationRequest.deleteMany();
    await Update.deleteMany();
    
    console.log('Database cleared.');

    // Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({ name: 'Admin One', email: 'admin@research.hub', password, role: 'Admin', skills: ['Management'], interests: ['Everything'] });
    const creator = await User.create({ name: 'Dr. Sarah', email: 'sarah@research.hub', password, role: 'Project Creator', skills: ['AI', 'Data Science'], interests: ['Agriculture', 'Tech'] });
    const mentor = await User.create({ name: 'Prof. John', email: 'john@research.hub', password, role: 'Mentor', skills: ['Reviewing', 'Architecture'], interests: ['Quantum Computing'] });
    const student1 = await User.create({ name: 'Hari Charan', email: 'hari@research.hub', password, role: 'Student', skills: ['React', 'Node.js', 'Python'], interests: ['Full Stack', 'Web3'] });
    const student2 = await User.create({ name: 'Alice', email: 'alice@research.hub', password, role: 'Student', skills: ['Design', 'UI/UX'], interests: ['Accessibility'] });

    // Ideas
    const idea1 = await Idea.create({
      title: 'AI Based Crop Health Agent',
      description: 'An AI wrapper utilizing computer vision to detect plant diseases early and suggest remedies.',
      tags: ['AI', 'Agriculture', 'Python', 'React'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }, { userId: student1._id, role: 'Member' }],
      status: 'In Progress'
    });

    const idea2 = await Idea.create({
      title: 'Quantum Computing Encryption Framework',
      description: 'Researching quantum resistant algorithms for next generation blockchain technologies. Searching for crypto experts and mathematicians.',
      tags: ['Quantum', 'Crypto', 'Web3'],
      createdBy: admin._id,
      teamMembers: [{ userId: admin._id, role: 'Creator' }],
      status: 'Open'
    });

    const idea3 = await Idea.create({
      title: 'Community Shared Renewable Grid IoT',
      description: 'Building an IoT framework to distribute excess solar power dynamically between nearby houses.',
      tags: ['IoT', 'Renewable Energy', 'Hardware'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }, { userId: student2._id, role: 'Member' }],
      status: 'Open'
    });

    const idea4 = await Idea.create({
      title: 'Brain-Computer Interface for Accessibility',
      description: 'Developing affordable BCI headbands to help paralyzed patients navigate web interfaces.',
      tags: ['Neurotech', 'Accessibility', 'Hardware', 'AI'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }],
      status: 'Open'
    });

    const idea5 = await Idea.create({
      title: 'Decentralized Academic Publishing Protocol',
      description: 'Using IPFS and Smart Contracts to create a zero-fee journal for open-science publications.',
      tags: ['Web3', 'Blockchain', 'Open Science'],
      createdBy: admin._id,
      teamMembers: [{ userId: admin._id, role: 'Creator' }, { userId: student1._id, role: 'Member' }],
      status: 'In Progress'
    });

    const idea6 = await Idea.create({
      title: 'Autonomous Swarm Drones for Reforestation',
      description: 'Programming drone swarms to map deforested areas and fire seed pods into optimal soil zones.',
      tags: ['Robotics', 'Climate Tech', 'C++'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }],
      status: 'Completed'
    });

    const idea7 = await Idea.create({
      title: 'LLM Agent for Automated Code Audits',
      description: 'A static analysis tool that uses fine-tuned LLMs to detect zero-day vulnerabilities in Smart Contracts.',
      tags: ['Cybersecurity', 'LLM', 'Solidity'],
      createdBy: student1._id,
      teamMembers: [{ userId: student1._id, role: 'Creator' }],
      status: 'In Progress'
    });

    const idea8 = await Idea.create({
      title: 'Carbon-Capture Nanomaterials Simulation',
      description: 'Running molecular dynamics simulations to test new porous synthetic materials for CO2 trapping.',
      tags: ['Materials Science', 'Chemistry', 'Simulation'],
      createdBy: admin._id,
      teamMembers: [{ userId: admin._id, role: 'Creator' }],
      status: 'Open'
    });

    const idea9 = await Idea.create({
      title: 'Smart City Traffic Flow Optimization',
      description: 'Analyzing live intersection camera data to optimize traffic light timings and reduce CO2 emissions.',
      tags: ['Data Science', 'Smart City', 'Computer Vision'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }, { userId: student2._id, role: 'Member' }],
      status: 'Completed'
    });

    const idea10 = await Idea.create({
      title: 'Personalized Medicine Genomics Pipeline',
      description: 'A scalable cloud pipeline converting raw genome sequence data into personalized drug efficacy reports.',
      tags: ['Bioinformatics', 'Cloud', 'Genomics'],
      createdBy: creator._id,
      teamMembers: [{ userId: creator._id, role: 'Creator' }],
      status: 'Open'
    });

    // Create Tasks
    await Task.create({ projectId: idea1._id, title: 'Setup React Frontend', description: 'Initialize the Vite project.', assignedTo: student1._id, status: 'Done' });
    await Task.create({ projectId: idea1._id, title: 'Train PyTorch Model', description: 'Run the transfer learning script on the leaf dataset.', assignedTo: creator._id, status: 'In Progress' });
    
    // Updates
    await Update.create({ projectId: idea1._id, userId: creator._id, message: 'We just hit 94% accuracy on training data!' });

    console.log('Database seeded successfully!');
    process.exit();

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

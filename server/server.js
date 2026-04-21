const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — allow Vercel frontend in production and localhost in development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://smart-research-collab.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/collaborations', require('./routes/collaborations'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/updates', require('./routes/updates'));

// Health check — Render pings this to confirm the service is alive
app.get('/', (req, res) => res.send('ResearchHub API is running ✓'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use dynamic PORT provided by Render (or fallback to 5001 locally)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

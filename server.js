require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes

app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);

// Serve static files (the frontend is in the same folder)
app.use(express.static(path.join(__dirname)));

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB and start server
async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinemora';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/intern-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Intern Schema
const internSchema = new mongoose.Schema({
  username: String,
  referralCode: String,
  donationsRaised: Number,
  rewards: [String]
});

const Intern = mongoose.model('Intern', internSchema);

// Routes
app.get('/api/interns', async (req, res) => {
  try {
    // For demo purposes, we'll just return one intern
    let intern = await Intern.findOne();
    
    if (!intern) {
      // Create a default intern if none exists
      intern = await Intern.create({
        username: 'John Doe',
        referralCode: 'johndoe2025',
        donationsRaised: 1250,
        rewards: ['Bronze Badge', 'Silver Badge']
      });
    }
    
    res.json(intern);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leaderboard route (Bonus)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Intern.find().sort({ donationsRaised: -1 }).limit(5);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
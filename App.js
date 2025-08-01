// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Login Component
function Login({ setIsLoggedIn }) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <h1>Intern Portal Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginForm.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
      <p className="signup-text">Don't have an account? <a href="#">Sign up</a></p>
    </div>
  );
}

// Dashboard Component
function Dashboard({ internData }) {
  return (
    <div className="dashboard">
      <header>
        <h1>Intern Dashboard</h1>
        <nav>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        </nav>
      </header>
      
      <div className="dashboard-content">
        <div className="profile-section">
          <h2>Welcome, {internData.username}!</h2>
          <div className="referral-code">
            <h3>Your Referral Code:</h3>
            <p>{internData.referralCode}</p>
          </div>
        </div>
        
        <div className="donations-section">
          <h3>Total Donations Raised</h3>
          <p className="donation-amount">${internData.donationsRaised.toLocaleString()}</p>
        </div>
        
        <div className="rewards-section">
          <h3>Your Rewards</h3>
          <div className="rewards-grid">
            {internData.rewards.map((reward, index) => (
              <div key={index} className="reward-item">
                <h4>{reward}</h4>
                <p>Unlocked!</p>
              </div>
            ))}
            <div className="reward-item locked">
              <h4>Gold Badge</h4>
              <p>Unlock at $2000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Leaderboard Component (Bonus)
function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(response => response.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, []);

  return (
    <div className="leaderboard">
      <h1>Top Interns</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Donations Raised</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((intern, index) => (
            <tr key={intern._id}>
              <td>{index + 1}</td>
              <td>{intern.username}</td>
              <td>${intern.donationsRaised.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

// Main App Component
function App() {
  const [internData, setInternData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/interns')
        .then(response => response.json())
        .then(data => setInternData(data))
        .catch(err => console.error('Error fetching data:', err));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard internData={internData} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
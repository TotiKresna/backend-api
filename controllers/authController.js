// authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRATION = '1d'; // Token berlaku selama 1 hari

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // Gunakan HTTPS di production
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      token: token,
      id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password, role: 'admin' });
    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

exports.checkAuth = (req, res) => {
  // Jika request mencapai titik ini, berarti token valid (karena sudah melewati authMiddleware)
  res.status(200).json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
};
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Cookie options based on environment
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

const register = async (req, res) => {
  try {
    console.log('Register body:', req.body);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    console.log('User created:', user._id);

    const token = generateToken(user._id);

    res.cookie('jwt', token, getCookieOptions());

    return res.status(201).json({
      success: true,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.log('Register error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login body:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);

    res.cookie('jwt', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.log('Login error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('jwt', '', { 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0) 
  });
  
  return res.status(200).json({ 
    success: true, 
    message: 'Logged out' 
  });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { register, login, logout, getMe };
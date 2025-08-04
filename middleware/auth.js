// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🚫 No Authorization header');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ User authenticated:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('❌ Invalid token');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


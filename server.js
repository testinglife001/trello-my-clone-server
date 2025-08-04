// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server: SocketIO } = require("socket.io");
const connectDB = require('./config/db');
require('dotenv').config();

// Create app and HTTP server
const app = express();
const server = http.createServer(app);

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json()); // For parsing application/json

// Attach Socket.IO
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make `io` accessible inside routes/controllers
app.set('io', io);

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/cards', require('./routes/cards'));

// ✅ Logging middleware - move this up
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin || 'unknown origin'}`);
  next();
});


// ✅ Socket.IO handlers
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`🧑‍🤝‍🧑 User ${socket.id} joined board ${boardId}`);
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(boardId);
    console.log(`👋 User ${socket.id} left board ${boardId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ✅ Default API status check
app.get('/', (req, res) => {
  res.send('MERN Backend is Live! API is running...');
});

// ✅ Logging middleware
// app.use((req, res, next) => {
//  console.log(`[${req.method}] ${req.url} from ${req.headers.origin || 'unknown origin'}`);
//  next();
// });

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

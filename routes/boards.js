// /routes/boards.js

const express = require('express');
const router = express.Router();
const { getBoards, getBoardById, createBoard } = require('../controllers/boardController');
const auth = require('../middleware/auth');

router.use(auth);

// router.route('/').get(getBoards).post(createBoard);
// router.route('/:id').get(getBoardById);

router.get('/', auth, getBoards);
router.get('/:id', auth, getBoardById);
router.post('/', auth, createBoard);

module.exports = router;
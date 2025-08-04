// /controllers/boardController.js

const Board = require('../models/Board');
const Activity = require('../models/Activity');

// Get all boards for a user
exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ members: req.user.id }).populate('members', 'name email');
        res.json(boards);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get a single board by ID
exports.getBoardById = async (req, res) => {
    try {

        
        const board = await Board.findById(req.params.id)
                .populate('members', 'name email')
                // .populate('lists')
                .populate({
                  path: 'lists',
                  populate: {
                      path: 'cards'
                  }
                })
                .populate('activity');
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        // ✅ Optional: match board.user === req.user.id if board is user-specific

         return res.json(board);

    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new board
exports.createBoard = async (req, res) => {
    const { name } = req.body;
    try {
        const newBoard = new Board({
            name,
            owner: req.user.id,
            members: [req.user.id],
        });
        const board = await newBoard.save();
        
        // Log activity
        const activity = new Activity({
            user: req.user.id,
            action: 'created',
            board: board._id,
            details: `board '${board.name}'`
        });
        await activity.save();
        
        // Push activity to board
        board.activity.push(activity);
        await board.save();
        
        res.status(201).json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
// /controllers/listController.js

const List = require('../models/List');
const Board = require('../models/Board');

// Create a new list
// controllers/list.controller.js
exports.createList = async (req, res) => {
  try {
    const { name, boardId } = req.body;

    const newList = new List({
      name,
      board: boardId,
    });
    const savedList = await newList.save();

    await Board.findByIdAndUpdate(boardId, {
      $push: { lists: savedList._id },
    });

    const io = req.app.get('io');
    io.to(boardId.toString()).emit('list-created', { boardId });


    res.status(201).json(savedList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create list' });
  }
};


// Update a list (e.g., rename)
exports.updateList = async (req, res) => {
    try {
        let list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ msg: 'List not found' });
        
        // Add authorization check
        
        list = await List.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(list);
    } catch(err) {
        res.status(500).send('Server Error');
    }
}


// /controllers/listController.js
// const Board = require('../models/Board');
/*
exports.reorderLists = async (req, res) => {
    const { boardId, newListOrder } = req.body; // newListOrder = [listId1, listId2, ...]

    try {
        const board = await Board.findById(boardId);
        if (!board || !board.members.includes(req.user.id)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Validate list IDs
        if (!Array.isArray(newListOrder) || newListOrder.some(id => typeof id !== 'string')) {
            return res.status(400).json({ msg: 'Invalid list order format' });
        }

        board.lists = newListOrder;
        await board.save();

        req.app.get('io').to(board._id.toString()).emit('board-update', { boardId });

        res.json({ msg: 'List order updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
*/


// /controllers/listController.js
// const List = require('../models/List');
// const Board = require('../models/Board');

// controllers/listController.js
// const Board = require('../models/Board');

exports.reorderLists = async (req, res) => {
  console.log('🔥 [REORDER] API called');
  console.log('👉 Request body:', req.body);
  console.log('👉 Authenticated user:', req.user);

  const { boardId, listOrder } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      console.log('❌ Board not found');
      return res.status(404).json({ msg: 'Board not found' });
    }

    if (!board.members.includes(req.user.id)) {
      console.log('❌ Not authorized - User not in board members');
      return res.status(401).json({ msg: 'Not authorized' });
    }

    board.lists = listOrder;
    await board.save();

    const io = req.app.get('io');
    if (!io) {
      console.log('⚠️ Socket.IO instance missing');
    } else {
      console.log('📢 Emitting board-update to room:', boardId);
      io.to(boardId).emit('board-update', {
        boardId,
        type: 'list-reorder',
      });
    }

    return res.status(200).json({ msg: 'List reordered successfully' });
  } catch (error) {
    console.error('❌ reorderLists failed:', error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};







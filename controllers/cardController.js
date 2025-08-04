// /controllers/cardController.js

const Card = require('../models/Card');
const List = require('../models/List');
const Board = require('../models/Board');
const Activity = require('../models/Activity');

// Create a new card
exports.createCard = async (req, res) => {
    // const { title, listId, boardId } = req.body;
    // console.log('Incoming POST /cards request:', req.body);
    try {
        const { title, listId, boardId } = req.body;

        if (!title || !listId || !boardId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
         const list = await List.findById(listId);
         const board = await Board.findById(boardId);


        const newCard = new Card({
            title,
            list: listId,
            board: boardId,
        });

        const card = await newCard.save();

        // Add card to list
        await List.findByIdAndUpdate(listId, { $push: { cards: card._id } });

        
        const activity = new Activity({
            user: req.user.id,
            action: 'created',
            board: boardId,
            entity: 'card',
            entityId: card._id,
            details: `card '${card.title}'`
        });
        await activity.save();

        board.activity.push(activity);
        await board.save();

        // Emit socket event
        req.app.get('io').to(boardId).emit('board-update', { boardId });

        // res.json(card);
        res.status(201).json(card);

    } catch (error) {
    console.error('Error adding card:', error.message);
    res.status(500).send('Server Error');
  }
};

// Move a card
/*
exports.moveCard = async (req, res) => {
    const { cardId, fromListId, toListId, toIndex } = req.body;
    
    try {
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ msg: 'Card not found' });

        // const fromList = await List.findById(fromListId);
        // const toList = await List.findById(toListId);
        const board = await Board.findById(card.board);
        const fromList = await List.findById(fromListId).populate('cards');
        const toList = fromListId === toListId ? fromList : await List.findById(toListId).populate('cards');
        // const card = await Card.findById(cardId);
        if (!fromList || !toList || !board.members.includes(req.user.id)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Remove card from original list
        // fromList.cards.pull(cardId);
        const oldIndex = fromList.cards.findIndex(c => c._id.equals(card._id));
        fromList.cards.splice(oldIndex, 1);
        await fromList.save();
        // await fromList.save();

        // Add card to new list at specified position
        // toList.cards.splice(toIndex, 0, cardId);
        toList.cards.splice(toIndex, 0, card._id);
        await toList.save();
        
        // Update card's list reference
        card.list = toListId;
        await card.save();

        // Log activity
        const activity = new Activity({
            user: req.user.id,
            action: 'moved',
            board: card.board,
            entity: 'card',
            entityId: card._id,
            details: `card '${card.title}' from '${fromList.name}' to '${toList.name}'`
        });
        await activity.save();
        board.activity.push(activity);
        await board.save();

        // Emit socket event to all members of the board
        req.app.get('io').to(card.board.toString()).emit('board-update', { boardId: card.board });

        res.json({ msg: 'Card moved successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
*/

// /controllers/cardController.js
// const Card = require('../models/Card');
// const List = require('../models/List');
// const Board = require('../models/Board');
// const Activity = require('../models/Activity');
/*
exports.moveCard = async (req, res) => {
    const { cardId, fromListId, toListId, toIndex } = req.body;

    try {
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ msg: 'Card not found' });

        const board = await Board.findById(card.board);
        if (!board || !board.members.includes(req.user.id)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const fromList = await List.findById(fromListId).populate('cards');
        const toList = fromListId === toListId ? fromList : await List.findById(toListId).populate('cards');

        if (!fromList || !toList) return res.status(404).json({ msg: 'One or both lists not found' });

        // Remove card from original list
        const oldIndex = fromList.cards.findIndex(c => c._id.equals(card._id));
        if (oldIndex === -1) return res.status(400).json({ msg: 'Card not found in fromList' });

        fromList.cards.splice(oldIndex, 1);
        await fromList.save();

        // Insert card into new list at toIndex
        toList.cards.splice(toIndex, 0, card._id);
        await toList.save();

        // Update card's list reference
        card.list = toListId;
        await card.save();

        // Log activity
        const activity = new Activity({
            user: req.user.id,
            action: 'moved',
            board: board._id,
            entity: 'card',
            entityId: card._id,
            details: `Card '${card.title}' moved from '${fromList.name}' to '${toList.name}'`,
        });
        await activity.save();

        board.activity.push(activity);
        await board.save();

        // Emit real-time update
        req.app.get('io').to(board._id.toString()).emit('board-update', { boardId: board._id });

        res.json({ msg: 'Card moved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
*/

// /controllers/cardController.js
// const Card = require('../models/Card');
// const List = require('../models/List');
// const Board = require('../models/Board');
// const Activity = require('../models/Activity');
/*
exports.moveCard = async (req, res) => {
  const { cardId, fromListId, toListId, toIndex } = req.body;
  console.log(req.body);

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    const board = await Board.findById(card.board);
    // const fromList = await List.findById(fromListId);
    // const toList = fromListId === toListId ? fromList : await List.findById(toListId);
    const fromList = await List.findById(fromListId).populate('cards');
    const toList = fromListId === toListId ? fromList : await List.findById(toListId).populate('cards');

    if (!fromList || !toList) return res.status(404).json({ msg: 'One or both lists not found' });

    if (!board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove card from source list
    const oldIndex = fromList.cards.findIndex(id => id.toString() === cardId);
    if (oldIndex === -1) return res.status(400).json({ msg: 'Card not found in fromList' });

    fromList.cards.splice(oldIndex, 1);
    await fromList.save();

    // Add card to new list at toIndex
    toList.cards.splice(toIndex, 0, card._id);
    await toList.save();

    // Update card's list reference
    card.list = toListId;
    await card.save();

    // Activity log
    const activity = new Activity({
      user: req.user.id,
      action: 'moved',
      board: card.board,
      entity: 'card',
      entityId: card._id,
      details: `Card '${card.title}' moved from '${fromList.name}' to '${toList.name}'`
    });
    await activity.save();

    board.activity.push(activity);
    await board.save();

    // Notify via socket.io
    req.app.get('io').to(card.board.toString()).emit('board-update', {
      boardId: card.board,
      type: 'card-move',
      cardId,
      fromListId,
      toListId,
      toIndex
    });

    res.json({ msg: 'Card moved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
*/

// controllers/cardController.js
// const Card = require('../models/Card');
// const List = require('../models/List');
// const Board = require('../models/Board');
// const Activity = require('../models/Activity');
/*
exports.moveCard = async (req, res) => {
  const { cardId, toListId, toIndex } = req.body;
  console.log(req.body);

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    const board = await Board.findById(card.board).populate('lists');

    if (!board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // 🔍 Find source list
    const fromList = await List.findOne({ _id: { $in: board.lists }, cards: card._id });
    const toList = await List.findById(toListId);

    if (!fromList || !toList) return res.status(404).json({ msg: 'List(s) not found' });

    const oldIndex = fromList.cards.findIndex(id => id.toString() === cardId);
    if (oldIndex === -1) return res.status(400).json({ msg: 'Card not found in fromList' });

    // Remove from old list
    fromList.cards.splice(oldIndex, 1);
    await fromList.save();

    // Add to new list at specified index
    toList.cards.splice(toIndex, 0, card._id);
    await toList.save();

    // Update card reference
    card.list = toListId;
    await card.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      action: 'moved',
      board: board._id,
      entity: 'card',
      entityId: card._id,
      details: `Moved card '${card.title}' from '${fromList.name}' to '${toList.name}'`,
    });
    await activity.save();

    board.activity.push(activity._id);
    await board.save();

    // Emit socket event
    req.app.get('io').to(board._id.toString()).emit('board-update', {
      boardId: board._id,
      type: 'card-move',
      cardId,
      fromListId: fromList._id,
      toListId,
      toIndex
    });

    res.json({ msg: 'Card moved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
*/


exports.moveCard = async (req, res) => {
  console.log("📦 req.body", req.body); // Add this
  const { cardId, fromListId, toListId, toIndex } = req.body;
  console.log(req.body);

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    const board = await Board.findById(card.board).populate('lists');

    if (!board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const fromList = await List.findById(fromListId);
    const toList = await List.findById(toListId);

    if (!fromList || !toList) return res.status(404).json({ msg: 'List not found' });

    // 🧠 Ensure the card is actually in the fromList
    const oldIndex = fromList.cards.findIndex(id => id.toString() === cardId);
    if (oldIndex === -1) return res.status(400).json({ msg: 'Card not in fromList' });

    fromList.cards.splice(oldIndex, 1);
    await fromList.save();

    toList.cards.splice(toIndex, 0, card._id);
    await toList.save();

    card.list = toListId;
    await card.save();

    const activity = new Activity({
      user: req.user.id,
      action: 'moved',
      board: board._id,
      entity: 'card',
      entityId: card._id,
      details: `Moved card '${card.title}' from '${fromList.name}' to '${toList.name}'`,
    });
    await activity.save();

    board.activity.push(activity._id);
    await board.save();

    req.app.get('io').to(board._id.toString()).emit('board-update', {
      boardId: board._id,
      type: 'card-move',
      cardId,
      fromListId,
      toListId,
      toIndex
    });

    res.json({ msg: 'Card moved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




// controllers/card.controller.js
// controllers/card.controller.js

exports.editCard = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedCard) return res.status(404).json({ message: 'Card not found' });

    res.status(200).json(updatedCard);
  } catch (err) {
    console.error('Error editing card:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// import Card from '../models/Card.js';
// import List from '../models/List.js';

exports.deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    // Remove card ID from list's cards array
    await List.findByIdAndUpdate(card.listId, {
      $pull: { cards: card._id },
    });

    await Card.findByIdAndDelete(id);
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



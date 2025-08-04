// /routes/cards.js

const express = require('express');
const router = express.Router();
const { createCard, moveCard, editCard, deleteCard } = require('../controllers/cardController');
const auth = require('../middleware/auth');

router.use(auth);

// router.post('/', createCard);
// router.put('/move', moveCard);

router.post('/', auth, createCard);
 router.put('/move', auth, moveCard);
 router.put('/:id' , auth, editCard);        // ✅ Edit a card
router.delete('/:id', auth, deleteCard);   // ✅ Delete a card


module.exports = router;
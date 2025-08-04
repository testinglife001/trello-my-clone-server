// /routes/lists.js

const express = require('express');
const router = express.Router();
const { createList, updateList, reorderLists } = require('../controllers/listController');
const auth = require('../middleware/auth');

router.use(auth);

// router.route('/').post(createList);
// router.route('/:id').put(updateList);

router.post('/', auth, createList);
router.put('/:id', auth, updateList);
// /routes/lists.js
router.put('/reorder', auth, reorderLists);

module.exports = router;
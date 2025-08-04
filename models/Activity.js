// /models/Activity.js

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true, // e.g., "created", "moved", "commented on"
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    entity: {
        type: String, // "card", "list"
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    details: {
        type: String, // e.g., "Card Title", "from List A to List B"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Activity', ActivitySchema);
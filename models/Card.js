// /models/Card.js

const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: { type: String, default: '' },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dueDate: {
        type: Date,
    },
    labels: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Card', CardSchema);
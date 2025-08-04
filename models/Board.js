// /models/Board.js

const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
        }
    ],
    activity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Board', BoardSchema);
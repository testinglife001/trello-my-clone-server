// /config/db.js
const mongoose = require('mongoose');
// import { connect } from 'mongoose';
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
           // useNewUrlParser: true,
           // useUnifiedTopology: true,
        });
        console.log('MongoDB Connected... 🚀');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
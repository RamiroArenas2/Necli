const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/NecliDB");

        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;

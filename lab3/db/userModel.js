/**
 * User Schema - Mongoose Model
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: String,
    description: String,
    occupation: String,
});

module.exports = mongoose.model('User', userSchema);

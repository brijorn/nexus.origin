const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: String,
        required: true,
    },
    profileDesc: {
        type: String,
    },
    status: {
        type: String,
    },
    badges: {
        type: String,
    },
    primaryGroup: {
        type: Boolean,
    },
    thumbnail: {
        type: String,
    },
    presence: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', userSchema, 'users');
const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: String,
    },
    primaryAccount: {
        type: String,
    }
})

module.exports = mongoose.model('Verification', verificationSchema, 'verification');
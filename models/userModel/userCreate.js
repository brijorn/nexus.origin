const userSchema = require('./user')
const mongoose = require('mongoose')
module.exports = async (message) => {
    const user = new userSchema({
        _id: mongoose.Types.ObjectId(),
        userID: message.author.id,
        badges: 'verified'

    })
    await user.save()
    .catch(err => console.error(err));
}
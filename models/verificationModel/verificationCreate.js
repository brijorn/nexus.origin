const mongoose = require('mongoose');
const verificationSchema = require('../../models/verificationModel/verification');

module.exports = async (user, accountID) => {
	user = new verificationSchema({
		_id: mongoose.Types.ObjectId(),
		userID: user,
		primaryAccount: accountID,
	});
	await user.save();
};
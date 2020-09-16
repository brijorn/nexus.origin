const mongoose = require('mongoose');
const verificationSchema = require('./verification');
const embed = require('../../functions/embed');
module.exports = async (user, accountId) => {
	await verificationSchema.updateOne({ userID: user }, { $set: { primaryAccount: accountId }, function(err) {
		console.log(err);
	} });
};
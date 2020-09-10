const ecoUserSchema = require('./user');
const mongoose = require('mongoose');
const level = require('./level').newLevel;
module.exports = async function(userId) {
	theuser = new ecoUserSchema({
		_id: mongoose.Types.ObjectId(),
		userId: userId,
		inventory: {
			amount: 0,
			types: 0,
			items: [],
		},
		balance: 0,
		levelling: {
			level: 1,
			current: 0,
			required: level(1),
		},
	});
	await theuser.save()
		.catch((err) => {console.log(err);});
	console.log('done');
};
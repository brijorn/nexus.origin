const item = require('./shop');
const mongoose = require('mongoose');
exports.init = async function(name) {
	const shop = new item({
		_id: mongoose.Types.ObjectId(),
		name: name,
		data: [],
	});
	await shop.save();
};
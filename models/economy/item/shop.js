const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		indexes: true,
	},
	data: {
		type: Array,
	},
});

module.exports = mongoose.model('shop', shopSchema, 'shop');
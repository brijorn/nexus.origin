const mongoose = require('mongoose');

const ecoUserSchema = new mongoose.Schema({

	_id: mongoose.Schema.Types.ObjectId,
	userId: {
		type: String,
		required: true,
		createIndexes: true,
	},
	inventory: {
		type: Object,
	},
	balance: {
		type: Number,
	},
	job: {
		type: Object,
		default: {
			name: 'Unemployed',
			income: 0,
			level: 1,
			past: [],
		},
	},
	commandsUsed: {
		type: Number,
		default: 0,
	},
	levelling: {
		type: Object,
	},


});

module.exports = mongoose.model('ecouser', ecoUserSchema, 'ecousers');
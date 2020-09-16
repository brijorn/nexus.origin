const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: {
		type: String,
		required: true,
		createIndexes: true,
	},
	prefix: {
		type: String,
		default: '?',
	},
	robloxToken: {
		type: String,
	},
	robloxGroup: {
		type: String,
	},
	roleBinds: {
		type: Array,
	},
	assetBinds: {
		type: Array,
	},
	gamepassBinds: {
		type: Array,
	},
	rankBinds: {
		type: Array,
	},
	suggestionInfo: {
		type: Object,
	},
	embedInfo: {
		type: Object,
		required: true,
	},
	permissions: {
		type: Object,
	},
	sessions: {
		type: Object,
	},
	verificationSettings: {
		type: Object,
	},
	welcome: {
		type: Object,
	},
	moderation: {
		type: Object,
	},
	applications: {
		type: Object,
	},
	points: {
		type: Object,
	},
	disabledModules: {
		type: Array,
	},
	disabledCommands: {
		type: Array,
	},
	logging: {
		type: Object,
	},
});


module.exports = mongoose.model('Guild', guildSchema, 'guilds');
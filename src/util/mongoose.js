const mongoose = require('mongoose');
const config = require('../config.json');
module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			reconnectTries: Number.MAX_VALUE,
			reconnectInterval: 500,
			poolSize: 5,
			connectTimeoutms: 10000,
			family: 4,
		};
		mongoose.connect(config.mongoinfo).dbOptions;
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;

		mongoose.connection.on('connected', () => {
			console.log('Mantle Database has successfully connected.');
		});
		mongoose.connection.on('err', err => {
			console.error(`Mantle Mongoose connection error: \n${err.stack}`);
		});
		mongoose.connection.on('disconnected', () => {
			console.warn('Mantle Mongoose connection lost');
		});
	},
};
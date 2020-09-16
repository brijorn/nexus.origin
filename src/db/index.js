const connectionString = 'postgres://origin:brijorn06@96.30.194.61:5432/origin';
const env = require('dotenv').config();
const knex = require('knex')({
	client: 'pg',
	version: '8.3',
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB,
	},
	pool: {
		min: 0,
		max: 7,
	},
});

module.exports = knex;

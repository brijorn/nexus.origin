import Knex from "knex"
const env = require("dotenv").config();

export default Knex({
		client: "pg",
		version: "8.3",
		connection: {
			host: process.env.DB_HOST,
			port: 5432,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB,
		},
		pool: {
			min: 0,
			max: 7,
		},
	});

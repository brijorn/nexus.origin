import OriginClient from "../lib/OriginClient";
import { Client } from "discord.js";
import Knex from "knex"
const env = require("dotenv").config();

export class DatabaseHandler {
	connection: Knex
	bot: OriginClient
	constructor(bot: OriginClient) {
		this.bot = bot
		this.connection = Knex({
			client: "pg",
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
			}
		})
		return this
	}
	public insert(schema: string, table: string, data: object): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.insert(data)
		.returning("*")
	}
	public get(schema: string, table: string, where: {}): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(where)
		.where(where)
	}

	public getOne(schema: string, table: string, where: {}): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
	}

	public has(schema: string, table: string, where: {}): Promise<any> | undefined {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where) || undefined
	}

	public update(schema: string, table: string, where: {}, data: object): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.update(data)
	}

	public updateOne(schema: string, table: string, where: {}, data: object): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.update(data)
	}

	public delete(schema: string, table: string, where: {}): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.delete()
	}

	public deleteOne(schema: string, table: string, where: {}): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
		.delete()
	}

	public save(schema: string, table: string, where: {}, data: {}): Promise<void> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
		.update(data)
	}


}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import OriginClient from "../lib/OriginClient";

import Knex from "knex"
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
	public insert<T>(schema: string, table: string, data: Record<string, any>): Promise<T> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.insert(data)
		.returning('*') as any as Promise<T>
	}
	public get(schema: string, table: string, where: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(where)
		.where(where)
	}

	public getOne(schema: string, table: string, where: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
	}

	public has(schema: string, table: string, where: Record<string, any>): Promise<any> | undefined {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where) || undefined
	}

	public update(schema: string, table: string, where: Record<string, any>, data: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.update(data)
	}

	public updateOne(schema: string, table: string, where: Record<string, any>, data: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.update(data)
	}

	public delete(schema: string, table: string, where: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.delete()
	}

	public deleteOne(schema: string, table: string, where: Record<string, any>): Promise<any> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
		.delete()
	}

	public save(schema: string, table: string, where: Record<string, any>, data: Record<string, any>): Promise<void> {
		return this.connection
		.withSchema(schema)
		.table(table)
		.where(where)
		.first()
		.update(data)
	}

	public decryptToken(guild_id: string): Promise<string> {
		return this.connection.raw(`
		SELECT pgp_sym_decrypt(token::bytea, '${process.env.TOKEN_KEY}') FROM guild
		WHERE guild_id = ?
		`, [guild_id])
		.then(query => query.rows[0].pgp_sym_decrypt)
	}

	public encryptToken(guild_id: string, token: string): Promise<void> {
		if (!process.env.TOKEN) throw new Error('Missing TOKEN_KEY In ENV')
		return this.connection.raw(`
		UPDATE "guild"
        SET token = pgp_sym_encrypt(?, ?)

    	WHERE guild_id = ?
		`, [token, process.env.TOKEN_KEY as string, guild_id])
	}

}
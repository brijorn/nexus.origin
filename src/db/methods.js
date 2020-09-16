const { Message } = require('discord.js');
const db = require('./');
const env = require('dotenv').config();
/**
 *
 * @param { Message } message
 */
exports.setToken = async function(message, newvalue) {
	const query = await db.raw(`

    UPDATE "guild"
        SET token = pgp_sym_encrypt('${newvalue}', '${process.env.TOKEN_KEY}')

    WHERE guild_id = ?

    `, [message.guild.id]);
	console.log(query);


	return message.channel.send('hello');
};

exports.decrypt = async function(message) {
	const query = await db.raw(`

    SELECT pgp_sym_decrypt(token::bytea, '${process.env.TOKEN_KEY}') FROM guild
    WHERE guild_id = ?
    `, [message.guild.id]);
	return query.rows[0].pgp_sym_decrypt;
};
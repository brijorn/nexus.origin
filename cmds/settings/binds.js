const { Client, Message } = require('discord.js');
const errorHandler = require('../../lib/errors');
const db = require('../../db/');
const bindDb = require('../../db/binding/schema');
const bind = require('../../lib/bind/');
/**
 *
 * @param { Client } bot
 * @param { Message } message
 * @param { Array } args
 * @param { Object } guild
 */
module.exports.run = async (bot, message, args, guild) => {
	const errors = await errorHandler(message, guild);

	const binds = await bindDb.get(message);
	if (!args[0]) {
		await bind.list.menu(message, binds);
	}

};

module.exports.help = {
	name: 'binds',
	description: 'View all of your server\'s bindings.',
	syntax: ['!binds group', '!binds asset', '!binds group <groupid>', '!binds asset <assetid>'],
};
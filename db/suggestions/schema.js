const db = require('../');
const { Message } = require('discord.js');

async function create() {
	db.schema.hasTable('suggestion_config', async function(table) {
		if (!table) {
			await db.withSchema('modules').createTable('suggestion_config', async function(doc) {
				doc.bigInteger('guild_id');
				doc.boolean('enabled');
				doc.string('channel');
				doc.bigInteger('amount');
				doc.string('FirstReaction');
				doc.string('SecondReaction');
				doc.specificType('whitelisted_roles', 'text Array');
				doc.specificType('blacklisted_roles', 'text Array');
				doc.specificType('admin_roles', 'text Array');
			});
		}
	});
}
/**
 * @param { Message } message
 */
exports.enable = async function(message) {
	await create();
	const data = await db.withSchema('modules').table('suggestion_config')
		.insert({
			guild_id: message.guild.id,
			enabled: true,
			channel: '',
			amount: 0,
			FirstReaction: '739276114542985278>',
			SecondReaction: '739276149800304643>',

		});
	const invite = bot.guilds.cache.get('727955617737605212');
	message.channel.send(invite);
	console.log(data);
};

exports.get = async function(guildid) {
	await create();

	const data = db.withSchema('modules').table('suggestion_config')
		.where('guild_id', '=', guildid)
		.then(function(res) {
			if (!res[0]) return false;
			else return res[0];
		});
	return data;
};

exports.update = async function(message, field, newvalue) {
	if (field === 'channel') {
		await db.withSchema('modules').table('suggestion_config')
			.where('guild_id', '=', message.guild.id)
			.update({
				channel: newvalue,
			});
	}
	if (field === 'FirstReaction') {
		await db.withSchema('modules').table('suggestion_config')
			.where('guild_id', '=', message.guild.id)
			.update({
				FirstReaction: newvalue,
			});
	}
	if (field === 'SecondReaction') {
		await db.withSchema('modules').table('suggestion_config')
			.where('guild_id', '=', message.guild.id)
			.update({
				SecondReaction: newvalue,
			});
	}
	if (field === 'enabled') {
		await db.withSchema('modules').table('suggestion_config')
			.where('guild_id', '=', message.guild.id)
			.update({
				enabled: newvalue,
			});
	}
	if (field === 'increment') {
		await db.withSchema('modules').table('suggestion_config')
			.where('guild_id', '=', message.guild.id)
			.update({
				amount: newvalue,
			});
	}
};

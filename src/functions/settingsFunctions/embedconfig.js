const { Message, Client, MessageEmbed } = require('discord.js');
const db = require('../../db');
const embed = require('../embed');
/**
 *
 * @param { Client } bot
 * @param { Message } message
 * @param { Array } args
 * @param { Object } guild
 */
module.exports = async (bot, message, args, guild) => {
	console.table(guild);

	// Show Settings Menu
	if (!args[1]) {
		const settings = new MessageEmbed()
			.setTitle('Embed Settings')
			.setDescription(`To configure a field run the command \`${guild.prefix}settings embed <field> <newvalue>\`. To disable a field set the value to none.`)
			.addField('Color', guild.embed.color, true)
			.addField('Text', guild.embed.footer, true)
			.addField('Logo', guild.embed.footerlogo, true)
			.setFooter('This only works on some embeds.');
		return message.channel.send(settings);
	}

	// Error
	if (args[1] && !args[2]) return message.channel.send('Give the value you wish to change this to.');


	// Change Embed Color
	if (args[1].toLowerCase() === 'color') {
		if (!args[2].startsWith('#')) return message.channel.send('Color must be a #Hex Color');
		guild.embed.color = args[2];
		return await build(message, guild, 'Color');
	}
	// Change Footer Text
	if (args[1].toLowerCase() === 'text') {
		const text = args.slice(2).join(' ');
		guild.embed.footer = text;
		return await build(message, guild, 'Text');
	}
	// Change Footer Logo
	if (args[1].toLowerCase() === 'logo') {
		guild.embed.footerlogo = args.slice(2).join(' ');
		return await build(message, guild, 'Logo');
	}

};

async function update(message, guild) {
	await db.table('guild').where('guild_id', '=', message.guild.id)
		.update(guild);
}

async function build(message, guild, title) {
	const text = title.toLowerCase();
	const finished = new MessageEmbed()
		.setTitle(`Embed ${title} Changed`)
		.setDescription(`The ${text} has been set on this embed.`)
		.setColor(guild.embed.color)
		.setFooter(guild.embed.footer, guild.embed.footerlogo);
	message.channel.send(finished);
	return await update(message, guild);
}
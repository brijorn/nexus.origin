const Discord = require('discord.js');
const pmprompt = require('../../prompt/index').pmprompt;
const guildModel = require('../../models/guildModel/guild');
const embed = require('../../functions/embed');
const rbx = require('noblox.js');
const methods = require('../../db/methods');
/**
 *
 * @param { Discord.Client } bot
 * @param { Discord.Message } message
 * @param { Array } args
 * @param { Object } guild
 */
module.exports.run = async (bot, message, args, guild) => {
	if (message.author.id !== message.guild.owner.id) return message.channel.send('This command is owner only.');
	if (args[0].toLowerCase() === 'status') {
		// Decrypt the token
		const token = await methods.decrypt(message);

		// Error If there isn't a token
		if (token === undefined) {
			return message.channel.send(embed('none',
				`There is no \`.ROBLOSECURITY\` setup for this guild. 
        You can set one with the ${prefix}token command.`, guild, 'failure', true, true));
		}

		// Set the token
		const set = await rbx.setCookie(token)
			.catch(() => { return message.channel.send(embed('none', `Cookie may be invalid, reset with the \`${guild.prefix}token\` command`, guild, 'failure', true, true));});

		// Make an embed about the account info
		const status = new Discord.MessageEmbed()
			.setTitle(`${set.UserName}`, true)
			.addField('ID', set.UserID, true)
			.addField('Premium', set.IsPremium, true)
			.addField('Robux', set.RobuxBalance, true)
			.setThumbnail(set.ThumbnailUrl)
			.setFooter(guild.embed.footer, (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '');

		// Send the Embed
		return message.channel.send(status);
	}
	// Ask for the Token In dms
	const tokenprompt = embed('Token Prompt', 'What is the .ROBLOSECURITY for the account?\n\nIf you don\'t know what that is, look it up.\n\nTo cancel respond **cancel**', guild)
		.setFooter('We will never look at nor share this. Feel free to delete your message after.');
	const ask = await pmprompt(message, tokenprompt);
	const res = ask.content.toLowerCase();
	if (res === 'cancel') return message.author.send(embed('none', 'Cancelled.', guild));
	if (ask.content.startsWith('_|WARNING:') === false) return message.author.send(embed('none', 'Token Authentication Failed: Please provide a valid `.ROBLOSECURITY` Cookie.', '#e02222', guild));
	await methods.setToken(message, ask.content);
	const successful = new Discord.MessageEmbed()
		.setDescription('Token Successfully updated. Delete the mesage for safety purposes.')
		.setColor('#4eed4e');
	message.author.send(successful);


};

module.exports.help = {
	name: 'token',
	module: 'settings',
	description: 'Token for the account used for ranking etc.',
	syntax: ['!token', '!token status'],
	cooldown: 300,
};
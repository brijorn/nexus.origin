const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');
const functions = require('../../../db/welcome/schema');
const embedconfig = require('./welcomeEmbed')
const embed = require("../../embed")
/**
 * @param { Message } message
 * @param { Client } bot
 * @param { Array } args
 */
module.exports = async (bot, message, args, guild) => {
	const welcome = await functions.get(message);
	if (args[1] && args[1] !== 'embed') {
		const welcomeconfig = require('./welcomeconfig');
		return await welcomeconfig(bot, message, args, guild, welcome);
	}
	if (args[1] === 'embed') {
		if (!args[2]) {
			const data = welcome.embed;
			const embedMenu = new MessageEmbed()
				.setTitle('Welcome Embed Menu')
				.setDescription(`To edit a value use \`${guild.prefix}settings welcome embed <value> <newvalue>\``)
				.addField('Title', data.title, true)
				.addField('Description', data.description, true)
				.addField('Color', data.color, true)
				.addField('Footer', data.footer, true)
				.addField('FooterLogo', data.footerlogo, true)
				.addField('Thumbnail', data.thumbnail, true)
				.addField('Image', data.image, true);
			message.channel.send(embedMenu);
		}
		if (args[2]) {
			return await embedconfig(bot, message, args, guild, welcome)
		}
	}
	else {
		const status = (welcome.enabled !== false) ? `${config.enabled}Enabled` : `${config.disabled}Disabled`;
		const channelstatus = (welcome.channel !== 'none') ? welcome.channel : 'None';
		const chanstat = (channelstatus !== 'dm' && channelstatus !== 'None') ? `<#${channelstatus}>` : channelstatus;
		const messagestatus = (welcome.welcome_message !== 'none') ? welcome.welcome_message : 'None';
		const embedStatus = (welcome.embed.enabled === true) ? `${config.enabled}Enabled` : `${config.disabled}Disabled`;
		const menuEmbed = new MessageEmbed()
			.setTitle('Welcome Menu')
			.setDescription(`Values can be configured with \`${guild.prefix}settings welcome <value>\``)
			.addField('Status', status, true)
			.addField('Channel', chanstat, false)
			.addField('Message', messagestatus, true)
			.addField('DM', welcome.embed.dm, true)
			.addField('Embed', embedStatus, true)
			.addField('Embed Settings', `To see/edit welcome embed settings, use \`${guild.prefix}settings welcome embed\``, true)
			.setFooter(`To test your welcome message you can run ${guild.prefix}settings welcome test`, (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '');
		message.channel.send(menuEmbed);
	}
};
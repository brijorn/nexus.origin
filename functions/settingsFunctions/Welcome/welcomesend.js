const formats = require('./welcomeformats.json');
const { MessageEmbed, GuildMember, GuildMember } = require('discord.js');
const moment = require('moment-timezone')
const functions = require('../../../db/welcome/schema')
/**
 * 
 * @param { GuildMember } member 
 * @param {*} guild 
 */
module.exports = async (member, guild) => {
	const welcome = await functions.get(member)
	const welcomemsg = welcome.welcome_message

	const data = welcome.embed
	const theEmbed = new MessageEmbed()
	for (const [key, value] of Object.entries(data)) {
		let newval = value
		formats.formats.forEach(e => {
			if (typeof newval === "string") {
				if (newval.includes(e.name)) {
					newval = newval.replace(new RegExp(e.name, 'g'), eval(e.changeto));
				}
			}
		})
		data[key] = newval
	}
	try {
		if (data.title !== 'none') theEmbed.setTitle(data.title)
		if (data.description !== 'none') theEmbed.setDescription(data.description)
		if (data.color !== 'none') theEmbed.setColor(data.color)
		if (data.footer !== 'none') theEmbed.setFooter(data.footer, (data.footerlogo !== 'none') ? data.footerlogo : '')
		if (data.image !== 'none') theEmbed.setImage(data.image)
		if (data.thumbnail !== 'none') theEmbed.setThumbnail(data.thumbnail)
	}
	catch(error) {
		console.log(error.message)
		message.channel.send(error.message)
	}

	const sendto = (welcome.dm === true) ? message.author : message.guild.channels.cache.get(welcome.channel);


	if (welcome.embed.enabled === false) {
		if (welcomemsg === 'none') return message.channel.send('No welcome message is setup')
		sendto.send(welcomemsg);
	}
	else sendto.send(theEmbed);

	return
};
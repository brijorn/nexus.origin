const Discord = require('discord.js');
module.exports = (title, description, guild, color = '#ab2db3', footer = true, timestamp = false) => {
	if (color === 'def') color = guild.embed.color;

	// Convert word to color so I dont have to fucking require config.json
	if (color === 'success') color = '#3bff86';
	if (color === 'failure') color = '#ff6257';

	// Convert title of 'none' to no title
	if (title === 'none') {
		const embed = new Discord.MessageEmbed()
			.setDescription(description);
		if (footer === true) embed.setFooter(guild.embed.footer, guild.embed.footerlogo);
		if (color === '#ab2db3') {
			embed.setColor(guild.embed.color);
		}
		else {
			embed.setColor(color);
		}
		if (typeof footer === 'string') embed.setFooter(footer)
		else if (footer === true && guild.embed.footer !== 'none') embed.setFooter(guild.embed.footer, (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '');
		if (timestamp === true) embed.setTimestamp();

		return embed;
	}

	else {
		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(description);
		if (typeof footer === 'string') embed.setFooter(footer)
		else if (footer === true && guild.embed.footer !== 'none') embed.setFooter(guild.embed.footer, (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '');
		if (color === '#ab2db3') {
			embed.setColor(guild.embed.color);
		}
		else {
			embed.setColor(color);
		}
		if (timestamp === true) embed.setTimestamp();
		return embed;
	}

};

module.exports.help = {
	name: 'embed',
};
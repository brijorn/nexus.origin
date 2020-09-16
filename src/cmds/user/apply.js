const embed = require('../../functions/embed');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const verification = require('../../models/verificationModel/verification');
module.exports.run = async (bot, message, args, guild) => {
	const app = guild.applications.apps;
	if (!guild.applications || guild.applications.enabled === false) return message.reply(embed('Applications Disabled', 'Applications are not enabled for this guild', guild));
	const applist = guild.applications.apps.map(each => {
		if (each.available === false) return;
		return `${each.name}`;
	}).join(', ');
	if (!args[0]) {
		const lister = new MessageEmbed()
			.setTitle('Give an Application')
			.setDescription(`Please run the command again with one of the following applications:\n\`${applist}\``);
		return message.channel.send(lister);
	}
	const arg = (args.length > 1) ? args.join(' ') : args[0];
	if (!app.find(one => one.name.toLowerCase() === arg.toLowerCase())) return message.reply(embed('Application Not Found', 'Could not find an application with that name.', guild, config.failure));
	const appfound = app.find(one => one.name.toLowerCase() === arg.toLowerCase());
	if (appfound.available === false) return message.reply(embed('Application Unavailable', 'The given application is currently unavailable :(', guild, config.failure));
	const appask = require('../../functions/settingsFunctions/Application/appask');
	message.channel.send('**This will continue in DMS**');
	const res = await appask(bot, message, args, guild, appfound.questions, appfound.name);
	let place = 1;
	let i = 0;
	const matcher = appfound.questions.map(r => `\`${place++}\` **${r}**\n${res[i++]}`).join('\n');
	const confirm = new MessageEmbed()
		.setTitle('Application Submitted')
		.setColor(config.success)
		.setDescription(`Your Responses\n${matcher}`)
		.setFooter('You will receive a response when youa application is accepted/denied.');
	message.author.send(confirm);
	const user = (await verification.findOne({ userID: message.author.id })) ? await verification.findOne({ userID: message.author.id }) : 'none';
	const req = new MessageEmbed()
		.setTitle(appfound.name)
		.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL(), `https://www.roblox.com/users/${user.primaryAccount}/profile`)
		.setDescription(matcher)
		.setColor('#ffad3b')
		.setFooter('Application')
		.setTimestamp();
	message.guild.channels.cache.get(appfound.channel).send(req);
};

module.exports.help = {
	name: 'apply',
	description: 'Apply for the given application',
	module: 'user',
	inDepth: 'Apply for the given application in their respective server. Only works if they are available or if you meet the set requirements.',

};
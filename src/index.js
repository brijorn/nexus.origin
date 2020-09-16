// Import Discord Creat Client
const Discord = require('discord.js');
const bot = new Discord.Client({partials: ['REACTION', 'MESSAGE']});

// File System
const fs = require('fs');

const guildModel = require('./models/guildModel/guild');
const db = require('./db');
const env = require('dotenv').config();

// Command Cooldowns
bot.suggestionCooldown = new Discord.Collection();

// Collection of all the commands
bot.cmds = new Discord.Collection();
bot.disabledMod = new Discord.Collection();


bot.on('guildCreate', guild => {
	const guildCreate = require('./models/guildModel/guildCreate');
	guildCreate(bot, guild);
});

const folders = ['verification', 'utility', 'settings', 'user', 'ranking', 'group', 'moderation', 'fun', 'economy', 
'suggestion', 'ticketing'];

folders.forEach(c => {
	fs.readdir(`./src/cmds/${c}`, (err, files) => {
		if (err) throw err;
		const arr = []
		for (i=0; i < 100; i++) arr.push(i)
		const jsfile = files.filter(f => f.split('.').pop() === 'js');
		jsfile.forEach((f, i) => {
			const prop = require(`./cmds/${c}/${f}`);
			bot.cmds.set(prop.help.name, prop);
		});
	});
});

const handlers = require('./handlers')

bot.on('ready', async () => {
	console.log(`All commands ready`)
	const moderate = require('./lib/util/moderation');
	await moderate.querying.query(bot);
});

bot.on('guildMemberAdd', async (member) => {
	if (guild.welcome && guild.welcome.enabled === true) {
		const welcomemsg = require('./functions/settingsFunctions/Welcome/welcomesend');
		await welcomemsg(member, guild);
	}
	if (guild.verificationSettings.autoVerify === true) {
		console.log(true);
		const autoVerify = require('./functions/verifyFunctions/joinVerify');
		return autoVerify(member, guild);
	}
	if (guild.verificationSettings.unverifiedEnabled === true) {
		member.roles.add(unverifiedRole)
			.catch(() => message.guild.owner.send('There seems to be a problem with the **Unverified** role.'));
	}
});

bot.on('messageReactionAdd', async (reaction, user) => {
	console.log(reaction.emoji)
	const messageid = reaction.message.id
	const panel = await db.withSchema('ticketing').table('ticket_interfaces')
	.where('guild_id', '=', reaction.message.guild.id)
	.where('message_id', '=', reaction.message.id)
	.where('message_reaction', '=', reaction.emoji.name)
	.first()
	if (!panel) return
});

bot.on('message', async message => {
	handlers.message(bot, message)
});

bot.login(process.env.TOKEN);

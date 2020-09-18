// Require
const Discord = require('discord.js');
const embed = require('../functions/embed');
// Database
const db = require('../db').default;

// Cooldown
const cooldownCheck = require('../functions/useful/cooldown');
const cooldowns = new Discord.Collection();

// Economy
const economy = '';
module.exports = async (bot, message) => {
	const start = Date.now();
	// Early Returns
	if (message.channel.type === 'dm') return;
	if (message.author.bot) return;
	const guild = await db.table('guild').where('guild_id', '=', message.guild.id).first();

	// Testing Prefix
	const prefix = '-';
	if (message.content.includes(message.client.user.id)) return message.channel.send(embed('none', `My prefix here is \`${prefix}\`.`, guild));
	if (!message.content.startsWith(prefix)) return;

	// Message content array
	const messageArray = message.content.split(' ');
	// Remove command and lowerCase

	const cmd = messageArray[0].slice(prefix.length).toLowerCase();

	// Get the command file
	const cmdFile = bot.cmds.get(cmd)
    || bot.cmds.find(c => c.help.aliases && c.help.aliases.includes(cmd));

	if (!cmdFile) return;
	if (bot.disabledMod.get(cmd)) return;

	// Check if the command uses the command as an argument
	const args = messageArray.slice(1);
	if (cmdFile.help.slice !== undefined && cmdFile.help.slice === false) args.unshift(cmd);

	// Economy Main Interface
	if (await economyCheck(cmdFile, message) === false) return;

	const cooldown = await cooldownCheck(message, cooldowns, cmdFile, prefix);
	if (cmdFile && cooldown === false) await cmdFile.run(bot, message, args, guild);

	// Time
	const end = Date.now();
	const finish = new Date(end - start);
	console.log(finish.getSeconds() + ' Seconds ' + finish.getMilliseconds() + ' Milliseconds');
};

async function economyCheck(cmdFile, message) {
	let state = true;
	const user = (cmdFile.help.module === 'economy' && cmdFile.help.name !== 'createdata') ?
		await economy.checkfor(message.author.id, message) : undefined;

	if (!user && cmdFile.help.module === 'economy' && cmdFile.help.name !== 'createdata') return state = false;
	if (cmdFile.help.module === 'economy') await economy.onCommand(message, user);
	return;
}
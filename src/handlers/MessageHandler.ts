import { Client, Message } from "discord.js";

// Require
const Discord = require('discord.js');
const embed = require('../functions/embed');
// Database
const db = require('../handlers/DatabaseHandler').default;

// Cooldown
const cooldownCheck = require('../functions/useful/cooldown');
const cooldowns = new Discord.Collection();

// Economy

export default async (bot: Client, message: Message) => {
	console.log('here 1')
	const start = Date.now();
	// Early Returns
	if (message.channel.type === 'dm') return;
	if (message.author.bot) return;
	const guild = await db.table('guild').where('guild_id', '=', message.guild!.id).first();

	// Testing Prefix
	const prefix = '-';
	if (message.content.includes(message.client!.user!.id)) return message.channel.send(embed('none', `My prefix here is \`${prefix}\`.`, guild));
	if (!message.content.startsWith(prefix)) return;

	// Message content array
	const messageArray = message.content.split(' ');
	// Remove command and lowerCase

	const cmd = messageArray[0].slice(prefix.length).toLowerCase();

	// Get the command file
	const cmdFile = (bot as any).cmds.get(cmd)
    || (bot as any).cmds.find((c: any) => c.help.aliases && c.help.aliases.includes(cmd));

	if (!cmdFile) return;

	// Check if the command uses the command as an argument
	const args = messageArray.slice(1);
	if (cmdFile.help.slice !== undefined && cmdFile.help.slice === false) args.unshift(cmd);

	const cooldown = await cooldownCheck(message, cooldowns, cmdFile, prefix);
	if (cmdFile && cooldown === false) await cmdFile.run(bot, message, args, guild);

	// Time
	const end = Date.now();
	const finish = new Date(end - start);
	return console.log(finish.getSeconds() + ' Seconds ' + finish.getMilliseconds() + ' Milliseconds');
};
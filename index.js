const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');
const embed = require('./functions/embed');
const guildModel = require('./models/guildModel/guild');
const cooldownCheck = require('./functions/useful/cooldown');
const economy = require('./models/economy/index');

const db = require('./db');
const { message } = require('noblox.js');
const env = require('dotenv').config();
// Command Cooldowns
const cooldowns = new Discord.Collection();
bot.suggestionCooldown = new Discord.Collection();
// Collection of all the commands
bot.cmds = new Discord.Collection();
bot.disabledMod = new Discord.Collection();
bot.mongoose = require('./util/mongoose');
bot.on('error', error => {
	if (error.length > 2000) error = error.splice(0, 2000);
	bot.channels.cache.get('740375898414383207').send(error);
});
bot.db = require('./db/index');

bot.on('guildCreate', guild => {
	const guildCreate = require('./models/guildModel/guildCreate');
	guildCreate(bot, guild);
});

const folders = ['verification', 'utility', 'settings', 'user', 'ranking', 'group', 'moderation', 'fun', 'economy', 'suggestion'];
folders.forEach(c => {
	fs.readdir(`./cmds/${c}/`, (err, files) => {
		if (err) throw err;
		console.log(`loaded ${c}`);
		const jsfile = files.filter(f => f.split('.').pop() === 'js');

		jsfile.forEach((f, i) => {
			const prop = require(`./cmds/${c}/${f}`);
			console.log(`${f} loaded!`);
			bot.cmds.set(prop.help.name, prop);
		});
	});
});

bot.on('ready', async () => {
	console.log('ready');
	const moderate = require('./lib/moderation');
	await moderate.querying.query(bot);
});

bot.on('guildMemberAdd', async (member) => {
	const guild = await guildModel.findOne({ guildID: member.guild.id });
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

bot.on('message', async message => {
	const start = Date.now()
	if (message.channel.type === 'dm') return;

	if (message.author.bot) return;
	const json = JSON.parse('{"color":"#29ffd8", "footer": "Origin", "footerlogo": "https://i.imgur.com/OcwzUHT.png"}');
	const guild = await db.table('guild').where('guild_id', '=', message.guild.id).first();
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
	const user = (cmdFile.help.module === 'economy' && cmdFile.help.name !== 'createdata') ? await economy.checkfor(message.author.id, message) : undefined;
	if (!user && cmdFile.help.module === 'economy' && cmdFile.help.name !== 'createdata') return;
	if (cmdFile.help.module === 'economy') await economy.onCommand(message, user);

	const cooldown = await cooldownCheck(message, cooldowns, cmdFile, prefix);
	if (cmdFile && cooldown === false) await cmdFile.run(bot, message, args, guild, user);

	const end = Date.now()

	const finish = new Date(end - start).getMilliseconds()
	console.log(finish)
});
bot.mongoose.init();
bot.login(process.env.TOKEN);

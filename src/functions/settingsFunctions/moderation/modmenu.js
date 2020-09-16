const embed = require('../../embed');
const prompt = require('../../../prompt/prompt');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../../config.json');
const role = require('../../../lib/parse/index').role;
module.exports = async (bot, message, args, guild) => {
	if (!guild.moderation && !args[1]) {
		message.channel.send(embed('No Moderation Settings', `This is your first time using moderation, you can create the default settings by running ${guild.prefix}settings mod default`, guild, '#'));
	}
	if (args[1] && args[1].toLowerCase() === 'default') {
		let cancelled = false;
		if (guild.moderation) {
			const msg = embed('Moderation Default', 'This will wipe all your moderation settings, are you sure?\nRespond `y` or `n`\nRespond **cancel** to cancel.', guild);
			let answer = await prompt(message, msg);
			answer = answer.toLowerCase();
			if (answer.startsWith('y')) {
				guild.moderation = { cases: guild.moderation.cases };
				await guild.save();
			}
			else {
				cancelled = true;
				return message.channel.send('cancelled');
			}
		}
		if (cancelled === false) {
			setup = {
				enabled: true,
				modrole: [],
				modlog: '',
				mutedrole: '',
				cases: 0,
				case: [],
				ongoing: [],
				other: {
					dm: true,
					deleteAfter: false,
					removeMute: true,
				},
				settings: [
					{
						name: 'warn',
						log: true,
						reqres: false,
						enabled: true,
					},
					{
						name: 'ban',
						log: true,
						reqres: false,
						enabled: true,
					},
					{
						name: 'kick',
						log: true,
						reqres: false,
						enabled: true,
					},
					{
						name: 'mute',
						log: '',
						reqres: false,
						enabled: true,
					},

				],
			};
			guild.moderation = setup;
			await guild.save();
			message.channel.send(embed('Moderation Default Settings', 'Your moderation settings have successfully been set to the default value', guild));
		}
	}
	if (guild.moderation && !args[1]) {
		let info = require('../settingspages');
		info = (await info(bot, message, args, guild)).modInfo;
		let role = guild.moderation.modrole;
		role = (role.length > 0) ? role.map(r => {
			if (r.startsWith('greaterthan')) {
				r = r.split('(')[1];
				r = r.substring(0, (r.length) - 1);
				return `${r} - <@&${r}>`;
			}
			else {return `${r} - <@&${r}>`;}
		}).join(', ') : 'None';
		const infoembed = new MessageEmbed()
			.setTitle('Moderation Settings')
			.setDescription(`You can run the command ${guild.prefix}settings mod <setting> to change a setting.`)
			.addField('Status', info.status, true)
			.addField('ModRole', role, true)
			.addField('ModLog', info.modlog, true)
			.addField('MutedRole', info.mutedrole, true)
			.addField('Cases', info.cases, true)
			.addField('Other', 'View', true)
			.setColor(guild.embedInfo.color);
		return message.channel.send(infoembed);

	}
	if (args[1].toLowerCase() === 'modrole') {
		const roleChange = require('./modRole');
		return await roleChange(bot, message, args, guild);
	}
	if (args[1].toLowerCase().includes('modlog')) {
		const parseChannel = require('../../../lib/parse/index').channel;
		let start = undefined;
		if (!args[2]) {
			start = await prompt(message, embed('Modlog Channel', 'What would you like to set the channel to?\nGive a `Channel-Name, Channel-Id or #Channel`', guild, '#'));
		}
		const channel = (start === undefined) ? await parseChannel(bot, message, args[2]) : await parseChannel(bot, message, start);
		if (channel.found === false) {return message.channel.send(embed('Channel Not Found', `Could not find the channel ${channel.pre}`));}
		else {
			guild.moderation.modlog = channel.pre;
			guild.markModified('moderation');
			await guild.save();
			return message.channel.send(embed('Modlog Configured', `Successfully set the modlog channel to <#${channel.pre}>`, guild, success));
		}
	}
	if(args[1].toLowerCase() === 'mutedrole') {
		const res = role(bot, message, args, guild, guild, 'moderation', 'mutedrole', 'MutedRole', 'string');

	}
};
const Discord = require('discord.js');
const embed = require('../../functions/embed');
const fetch = require('node-fetch');
const verify = require('../../functions/verifyFunctions/VerifyFunction');
const rbx = require('noblox.js');
const config = require('../../config.json');
const roleCheck = require('../../functions/verifyFunctions/roleAddCheck');
const { prompt, dmprompt } = require('../../prompt/index');
const verificationModel = require('../../models/verificationModel/verification');
const nicknaming = require('../../functions/verifyFunctions/nicknaming');
const thumbnail = require('../../functions/thumbnailFunction');
module.exports.run = async (bot, message, args, guild) => {
	const sendtype = (guild.verificationSettings.dmVerifications === true) ? await message.author : await message.channel;
	const ask = (guild.verificationSettings.dmVerifications === true) ? dmprompt : prompt;
	await message.react('740748381223256075');
	const setCookie = (!guild.robloxToken) ? await rbx.setCookie(config.robloxtoken) : await rbx.setCookie(guild.robloxToken);

	const checkforAccount = await verificationModel.exists({ userID: message.author.id });

	if (checkforAccount === true) {
		const user = await verificationModel.findOne({ userID: message.author.id });
		const roleAdd = await roleCheck(bot, message, guild);
		const newUsername = await rbx.getUsernameFromId(user.primaryAccount);
		const Verified = new Discord.MessageEmbed()
			.setDescription(`You were successfully verified as ${newUsername}`)
			.setColor(config.success);
		if (roleAdd !== undefined) {
			if (roleAdd.rolesAdded.length !== 0) {
				const eachrole = roleAdd.rolesAdded.map(each => `${each}`);
				Verified.addField('Roles Added', eachrole, true);
			}
			if (roleAdd.rolesRemoved.length !== 0) {
				const eachrole = roleAdd.rolesRemoved.map(each => `${each}`);
				Verified.addField('Roles Removed', eachrole, true);
			}

			if (guild.verificationSettings.nicknaming === true) {
				const nick = await nicknaming(message, guild, newUsername, roleAdd.roleInfo);
				Verified.setDescription(Verified.description + `\nNickname: \`${nick}\``);
			}
		}
		const avatar = await thumbnail(user.primaryAccount, '420', 'user');
		Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.primaryAccount}/profile`);
		message.reactions.cache.map(each => each.remove());
		message.react('740751221782085655');
		sendtype.send(Verified);
	}
	if (checkforAccount === false) {
		fetch(`https://api.blox.link/v1/user/${message.author.id}`).then(async bod => {
			const body = await bod.json();

			if (body.status === 'error') {
				const verifQues = new Discord.MessageEmbed()
					.setTitle('Verification')
					.setDescription('What is your roblox username?')
					.setColor('#f79a36');
				const res = await ask(message, daembed);
				verify(message, bot, res, guild);
			}
			else {

				const verificationcreate = require('../../models/verificationModel/verificationCreate');
				await verificationcreate(message.author.id, body.primaryAccount);

				const roleAdd = await roleCheck(bot, message, guild);
				const newUsername = await rbx.getUsernameFromId(body.primaryAccount);
				const Verified = new Discord.MessageEmbed()
					.setDescription(`You were successfully verified as ${newUsername}`)
					.setColor(config.success);
				if (roleAdd !== undefined) {
					if (roleAdd.rolesAdded.length !== 0) {
						const eachrole = roleAdd.rolesAdded.map(each => `${each}`);
						Verified.addField('Roles Added', eachrole, true);
					}
					if (roleAdd.rolesRemoved.length !== 0) {
						const eachrole = roleAdd.rolesRemoved.map(each => `${each}`);
						Verified.addField('Roles Removed', eachrole, true);
					}

					if (guild.verificationSettings.nicknaming === true) {
						const nick = await nicknaming(message, guild, newUsername, roleAdd.roleInfo);
						Verified.setDescription(Verified.description + `\nNickname: \`${nick}\``);
					}
				}
				const avatar = await thumbnail(user.primaryAccount, '420', 'user');
				Verified.setAuthor(newUsername, avatar, `https://www.roblox.com/users/${user.primaryAccount}/profile`);
				message.reactions.cache.map(each => each.remove());
				message.react('740751221782085655');
				sendtype.send(Verified);


			}


		});
	}

};

module.exports.help = {
	name: 'verify',
	module: 'verification',
	description: 'Link your roblox account to your discord account.',
	cooldown: 5,
};
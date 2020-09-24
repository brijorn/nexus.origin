import { Message } from "discord.js";
import { VerificationSettings, GuildSettings } from "../../../typings/origin";

import config from '../../../lib/util/json/config.json';
import { MessageEmbed } from 'discord.js';
import { editStart } from "../../../lib/util/prompt";
import embed from "../../embed";
import OriginClient from "../../../lib/OriginClient";

const role = require('../../../lib/parse/index').role;
module.exports = async (bot: OriginClient, message: Message, args: any[], guild: GuildSettings) => {
	const verification = await bot.handlers.verification.settings.fetch(message.guild!.id)
	bot.handlers.verification
	const mainGroup = verification.role_binds.find((o) => o.main === true)
	if (!args[1]) {
		const unverifiedStatus = (verification.unVerifiedEnabled === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const dmVerificationStatus = (verification.dmVerification === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const nicknameStatus = (verification.nicknaming === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const autoVerifyStatus = (verification.autoVerify === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		console.log(verification.unVerifiedRole);
		const verifiedRoleStatus = (verification.verifiedRole === '' || verification.verifiedRole === null) ? 'None' : `${message.guild!.roles.cache.get(verification.verifiedRole)}` + ' : ' + verification.verifiedRole;
		const unVerifiedRoleStatus = (verification.unVerifiedRole === '' || verification.unVerifiedRole === null) ? 'None' : `${message.guild!.roles.cache.get(verification.unVerifiedRole)}` + ' : ' + verification.unVerifiedRole;

		const info = new MessageEmbed()
			.setTitle('Verification Settings')
			.setDescription(`You can run the command ${guild.prefix}settings verification <setting> to change a setting.`)
			.addField('Group', `[${mainGroup!.id}](https://www.roblox.com/groups/${mainGroup!.id})`, true)
			.addField('VerifiedRole', verifiedRoleStatus, true)
			.addField('Bound Roles', mainGroup!.binds.length, true)
			.addField('UnverifiedEnabled', unverifiedStatus, true)
			.addField('UnverifiedRole', unVerifiedRoleStatus, true)
			.addField('AutoVerify', autoVerifyStatus, true)
			.addField('Nicknaming', nicknameStatus, true)
			.addField('NicknameFormat', verification.nicknaming, true)
			.addField('dmVerification', dmVerificationStatus, true);
		const mainpage = await message.channel.send(info);
		return;
	}
	const arg1low = args[1].toLowerCase();
	if (arg1low === 'unverified' || arg1low === 'unverifiedenabled') {
		await enabledisable(bot, message, args, guild, verification, 'unVerifiedRole');
	}
	if (arg1low === 'unverifiedrole') {
		const unverified = require('../../../lib/role');
		await role(bot, message, args, guild, 'unverifiedRole', 'Unverified');
	}
	if (arg1low === 'nicknaming' || arg1low === 'nickname') {
		await enabledisable(bot, message, args, guild, verification, 'nicknaming');
	}
	if (arg1low === 'verified' || arg1low === 'verifiedrole') {
		const role = require('../../../lib/role');
		await role(bot, message, args, guild, 'verifiedRole', 'Verified');
	}
	if (arg1low === 'nicknameformat') {
		const nickformat = require('./nicknameFormat');
		await nickformat(bot, message, args, guild);
	}
	if (arg1low === 'autoverify') {
		await enabledisable(bot, message, args, guild, verification, 'autoVerify');
	}
	if (arg1low.includes('dm')) {
		await enabledisable(bot, message, args, guild, verification, 'dmVerification');
	}
};

async function enabledisable(bot: OriginClient, message: Message, args: string[],guild: GuildSettings, verification: VerificationSettings, setting: (keyof VerificationSettings)) {
	const requiredResponse: string[] = ['enable', 'disable', 'true', 'false']
	let state: boolean = false
	let value: any
	if (args[2]) {
		const argument = args[2].toLowerCase()
		state = (requiredResponse.includes(argument)) ? true : false
		value = (argument === 'true' || argument == 'false') ? true : false
	}
	else {
		const startPrompt = await new editStart(message, embed(
			`${setting} Configuration`,
			`Would you like to \`enable\` or \`disable\` ${setting}?\n\nRespond **cancel** to cancel.`,
			guild, '', false, false
		)).init()
		const argument: string = startPrompt!.content.toLowerCase()
		if (startPrompt!.content.toLowerCase() === 'cancel' || !startPrompt) return startPrompt!.message.delete({ timeout: 5000 })
		state = (requiredResponse.includes(argument)) ? true : false
		value = (argument === 'true' || argument == 'false') ? true : false
	}
	if (state === false) return message.channel.send(embed(
		'Error',
		`Invalid Response given, valid responses: ${requiredResponse.map(e => `${e}`).join(', ')}`,
		guild, 'failure', false, true
	))
	else {
		const enabled_disabled = (value === true) ? 'enabled' : 'disabled'
		message.channel.send(embed(
			`${setting} Configured`,
			`Successfully ${enabled_disabled} ${setting}`,
			guild, 'success', false, true
		))
		return await verification.save()
	}
}
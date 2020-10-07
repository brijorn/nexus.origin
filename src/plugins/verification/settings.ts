import { GuildSettings } from "../../typings/origin";
import config from '../../lib/util/json/config.json';
import { Message, MessageEmbed } from 'discord.js';
import OriginClient from "../../lib/OriginClient";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import { parseRole } from '../../lib/util/parse'
import enabledisable from '../../lib/util/enabledisable'

export default async (bot: OriginClient, message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message|void> => {
	if (!message.guild) return message.error('Bot Error: Try running the command again')

	const verification = await bot.handlers.verification.settings.fetch(message.guild.id)
	bot.handlers.verification
	const mainGroup = verification.role_binds.find((o) => o.main === true)
	if (!args[1]) {
		const unverifiedStatus = (verification.unVerifiedEnabled === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const dmVerificationStatus = (verification.dmVerification === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const nicknameStatus = (verification.nicknaming === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		const autoVerifyStatus = (verification.autoVerify === true) ? `${config.enabled} Enabled` : `${config.disabled} Disabled`;
		console.log(verification.unVerifiedRole);
		const verifiedRoleStatus = (verification.verifiedRole === '' || verification.verifiedRole === null) ? 'None' : `${message.guild.roles.cache.get(verification.verifiedRole)}` + ' : ' + verification.verifiedRole;
		const unVerifiedRoleStatus = (verification.unVerifiedRole === '' || verification.unVerifiedRole === null) ? 'None' : `${message.guild.roles.cache.get(verification.unVerifiedRole)}` + ' : ' + verification.unVerifiedRole;

		const info = new MessageEmbed()
			.setTitle('Verification Settings')
			.setDescription(`You can run the command ${guild.prefix}settings verification <setting> to change a setting.`)
			.addField('Group', `[${mainGroup?.id}](https://www.roblox.com/groups/${mainGroup?.id})`, true)
			.addField('VerifiedRole', verifiedRoleStatus, true)
			.addField('Bound Roles', mainGroup?.binds.length, true)
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
		const value = await enabledisable(message, 'unverifiedEnabled')
		if (!value) return
		verification.unverified_enabled = value
		await verification.save()
	}
	if (arg1low === 'unverifiedrole') {
		parseRole(message.guild, 'Unverified');
	}
	if (arg1low === 'nicknaming' || arg1low === 'nickname') {
		const value = await enabledisable(message, 'nicknaming');
		if (!value) return
		verification.nicknaming = value
		await verification.save()
	}
	if (arg1low === 'verified' || arg1low === 'verifiedrole') {
		parseRole(message.guild, 'Verified');
	}
	if (arg1low === 'nicknameformat') {
		console.log('hi')
	}
	if (arg1low === 'autoverify') {
		const value = await enabledisable(message, 'autoVerify');
		if (!value) return
		verification.autoVerify = value
		await verification.save()
	}
	if (arg1low.includes('dm')) {
		const value = await enabledisable(message, 'dmVerification');
		if (!value) return
		verification.dm_verification = value
		await verification.save()
	}
};
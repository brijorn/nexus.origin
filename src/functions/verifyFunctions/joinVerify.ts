import { GuildMember } from "discord.js";
import { GuildSettings } from "../../typings/origin";

import embed from '../embed';
import noblox from 'noblox.js';
import roleCheck from './roleAddCheck';
import OriginClient from "../../lib/OriginClient";
import nicknaming from './nicknaming'
module.exports = async (bot: OriginClient, member: GuildMember, guild: GuildSettings) => {
	const verification = await bot.handlers.verification.settings.fetch(member.guild.id)
	const answer = await bot.handlers.verification.users.fetch(member.id);
	if (answer) {
		console.log('here');
		const user = answer;
		const username = await noblox.getUsernameFromId(user.primary_account)
		member.send(embed('Auto Verification', 'You have successfully been verified in ' + `**${member.guild.name}** as ` + username, guild));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const roleInfo = await roleCheck(member, member.guild, user, verification)
		if (verification.nicknaming === true) {
			if (!roleInfo) return;
			return await nicknaming(member, member.guild, verification, username, roleInfo.roleInfo);
		}
	}
	if (!answer) {
		fetch(`https://api.blox.link/v1/user/${member.id}`).then(async bod => {
			const body = await bod.json();

			if (body.status === 'error') {return;}
			else {
				const verificationcreate = await bot.handlers.verification.users.create(member.id, body.primaryAccount)
				const roleAdd = await roleCheck(member, member.guild, verificationcreate, verification);
				if (verification.nicknaming === true) {
					if (!roleAdd) return
					return await nicknaming(member, member.guild, verification, await noblox.getUsernameFromId(body.primaryAccount), roleAdd.roleInfo);
				}
				member.send(`Welcome to **${member.guild.name}** you were successfully verified with Bloxlink.`);
			}
		});
	}
};
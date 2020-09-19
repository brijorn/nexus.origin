import { GuildMember } from "discord.js";
import db from "../../db";
import GuildSettings from "../../db/guild/types";
import { VerificationSettings } from "../../db/verification/types";
import { GetUser } from "../../db/verification/user/schema";

import embed from '../embed';
import noblox from 'noblox.js';
import roleCheck from './roleAddCheck';
module.exports = async (member: GuildMember, guild: GuildSettings) => {
	const verification: VerificationSettings = await db.withSchema('modules').table('verification').first()
	const answer = await GetUser(member.user.id);
	if (answer) {
		console.log('here');
		const user = answer;
		const username = await noblox.getUsernameFromId(user.primaryAccount);
		member.send(embed('Auto Verification', 'You have successfully been verified in ' + `**${member.guild.name}** as ` + username, guild));
		await roleCheck(undefined as any, undefined as any, guild, verification, 'upd', member);
		if (verification.nicknaming === true) {
			const nicknaming = require('./nicknaming');
			return await nicknaming(member, guild, username);
		}
	}
	if (!answer) {
		fetch(`https://api.blox.link/v1/user/${member.id}`).then(async (bod: any) => {
			const body = await bod.json();

			if (body.status === 'error') {return;}
			else {
				const verificationcreate = require('../../models/verificationModel/verificationCreate');
				await verificationcreate(member.id, body.primaryAccount);
				const roleCheck = require('./roleAddCheck');
				const roleAdd = roleCheck(undefined, undefined, guild, 'upd', member);
				if (verification.nicknaming === true) {
					const nicknaming = require('./nicknaming');
					return await nicknaming(member, guild, await noblox.getUsernameFromId(body.primaryAccount));
				}
				member.send(`Welcome to **${member.guild.name}** you were successfully verified with Bloxlink.`);
			}
		});
	}
};
import { GuildMember } from 'discord.js';
import { getUsernameFromId } from 'noblox.js';
import { RegularEmbed } from '../../functions/embed';
import nicknaming from '../../functions/verifyFunctions/nicknaming';
import roleAddCheck from '../../functions/verifyFunctions/roleAddCheck';
import OriginClient from '../../lib/OriginClient';
import { VerificationSettings } from '../../typings/origin';

export default async (
	bot: OriginClient,
	member: GuildMember,
	verification: VerificationSettings,
): Promise<void> => {
	const answer = await bot.handlers.verification.users.fetch(member.id);
	if (answer) {
		const user = answer;
		const username = await getUsernameFromId(user.primary_account);
		member.send(
			RegularEmbed({
				title: 'Auto Verification',
				description: `You have been automatically verified in ${member.guild.name} as ${username}`,
			}),
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const roleInfo = await roleAddCheck(
			member,
			member.guild,
			user,
			verification,
		);
		if (verification.nicknaming === true) {
			if (!roleInfo) return;
			return await nicknaming(
				member,
				member.guild,
				verification,
				username,
				roleInfo.roleInfo,
			);
		}
	}
	if (!answer) {
		fetch(`https://api.blox.link/v1/user/${member.id}`).then(async (bod) => {
			const body = await bod.json();

			if (body.status === 'error') {
				if (verification.unverified_enabled) {
					try {
						member.roles.add(verification.unverified_role);
					} catch {
						return;
					}
				}
			} else {
				const verificationcreate = await bot.handlers.verification.users.create(
					member.id,
					body.primaryAccount,
				);
				const roleAdd = await roleAddCheck(
					member,
					member.guild,
					verificationcreate,
					verification,
				);
				if (verification.nicknaming === true) {
					if (!roleAdd) return;
					return await nicknaming(
						member,
						member.guild,
						verification,
						await getUsernameFromId(body.primaryAccount),
						roleAdd.roleInfo,
					);
				}
				member.send(
					`Welcome to **${member.guild.name}** you were successfully verified with Bloxlink.`,
				);
			}
		});
	}
};

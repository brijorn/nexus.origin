/* eslint-disable @typescript-eslint/no-explicit-any */
import { Guild, GuildMember } from 'discord.js';
import { VerificationSettings } from '../../typings/origin';

import formats from '../../lib/util/json/formats.json';

export default async (
	member: GuildMember,
	guild: Guild,
	verification: VerificationSettings,
	newUsername: string,
	roleInfo: Record<string, any>,
	type = 'Def',
): Promise<any> => {
	let format: string = roleInfo.nickname;
	if (format === 'default') format = verification.nickname_format;
	formats.nicknameformats.forEach((each) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	const special = type === 'rank' ? formats.rank : formats.asset;
	special.forEach((each) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	member.setNickname(format).catch((err) => {
		return 'Failed to Nickname';
	});
	return format;
};

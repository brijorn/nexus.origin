import { Guild, GuildMember, Message, User } from "discord.js";
import { VerificationSettings,GuildSettings } from "../../typings/origin";

import formats from '../../lib/util/json/formats.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (member: GuildMember, guild: Guild, verification: VerificationSettings, newUsername: string, roleInfo: Record<string, any>, type = 'Def'): Promise<string> => {
	console.log(roleInfo)
	let format: string = roleInfo.obj.nickname;
	if (format === 'default') format = verification.nickname_format;
	formats.nicknameformats.forEach((each) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	const special = (type === 'rank') ? formats.rank : formats.asset;
	special.forEach((each) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	}); 
	member
	.setNickname(format)
		.catch((err) => {return});
	return format;
};
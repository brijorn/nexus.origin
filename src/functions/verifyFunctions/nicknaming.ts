import { Message } from "discord.js";
import { VerificationSettings,GuildSettings } from "@lib/origin";

const formats = require('../../json/formats.json');

export default async (message: Message, guild: GuildSettings, verification: VerificationSettings, newUsername: string, roleInfo: any, type = 'Def') => {
	console.log(verification)
	let format: string = roleInfo.obj.nickname;
	if (format === 'default') format = verification.nickname_format;
	formats.nicknameformats.forEach((each: any) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	const special = (type === 'rank') ? formats.rank : formats.asset;
	special.forEach((each: any) => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	message.member!
	.setNickname(format)
		.catch((err) => {return});
	return format;
};
import { Message } from "discord.js";
import GuildSettings from "../../db/guild/types";
import { VerificationSettings } from "../../db/verification/types";

const formats = require('../../json/formats.json');

export default async (message: Message, guild: GuildSettings, verification: VerificationSettings, newUsername: string, roleInfo: any, type = 'Def') => {
	console.log(verification)
	let format: string = roleInfo.obj.nickname;
	if (format === 'default') format = verification.nicknameFormat;
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
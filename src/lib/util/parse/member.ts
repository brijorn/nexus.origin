import { GuildMember, Message } from "discord.js";

export default async (message: Message, value: any, slice: boolean = true) => {
	let mentioned: any = '';
	if (value.startsWith('<@') && value.endsWith('>')) {
		const channelb = value.substring(3);
		const finished = channelb.substring(0, channelb.length - 1);
		console.log(finished);
		mentioned = message.guild!.members.cache.get(finished);
		return mentioned;
	}
	if (isNaN(value) === false) {
		mentioned = message.guild!.members.cache.get(value);
		if (!mentioned) return;
		return mentioned;
	}
	if (!(value.startsWith('<@') && !value.endsWith('>')) && isNaN(value) === true) {
		async function findUser(givenuser: any) {
			givenuser = givenuser.toLowerCase();
			let founduser = undefined;
			message.guild!.members.cache.find((user: any) => {
				if (user.nickname === null) {
					if (user.user.username.toLowerCase() === givenuser) return founduser = user;
				}
				if (user.nickname !== null) {
					if (user.nickname.toLowerCase() === givenuser) return founduser = user;
					if (user.user.username.toLowerCase() === givenuser) return founduser = user;
				}
			});
			return founduser;
		}
		mentioned = await findUser(value);
		if (!mentioned) return;
	}
	return mentioned as GuildMember;
};
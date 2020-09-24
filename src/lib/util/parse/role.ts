import { Message, Client } from "discord.js";

export default async (message: Message, value: any) => {

	let state: Boolean = false;
	if (value.startsWith('<#') && value.endsWith('>')) {
		value = value.substring(3);
		value = value.substring(0, value.length - 1);
		if (message.guild!.roles.cache.get(value)) {
			value = message.guild!.roles.cache.get(value)!.id;
			state = true;
		}
		else {return;}
	}
	if (isNaN(value) === false && state === false) {
		if (message.guild!.roles.cache.get(value)) return { value: message.guild!.roles.cache.get(value)!.id, state: true };
		else return;
	}
	if (state === false) {
		if (message.guild!.roles.cache.find(c => c.name === value)) {
			value = message.guild!.roles.cache.find(c => c.name.toLowerCase() === value.toLowerCase())!.id;
			state = true;
		}
	}
	return {
		state,
		value,
	};
};
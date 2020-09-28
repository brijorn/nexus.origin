import { Message } from "discord.js";

export default (message: Message, value: string): string | undefined => {
	if (value.startsWith('<#') && value.endsWith('>')) {
		value = value.substring(2);
		value = value.substring(0, value.length - 1);
		const findChannel = message.guild?.channels.cache.get(value)?.id || undefined
		if (findChannel) return findChannel
	}
	if (isNaN(value as unknown as number) === false) {
		const findChannel = message.guild?.channels.cache.get(value)?.id || undefined
		if (findChannel) findChannel
	}
	else {
		const findChannel = message.guild?.channels.cache.get(value)?.id || undefined
		if (findChannel) return findChannel
	}
	return
};
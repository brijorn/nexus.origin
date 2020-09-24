import { Message } from "discord.js";

export default async (message: Message, prompt: any, returnAll: Boolean = false) => {
	const filter = (response: any) => response.author.id === message.author.id;

	const channel = await message.author.createDM();
	const instance = await channel.send(prompt);

	return channel
		.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first()!.content;
			const message = instance;
			const values = (returnAll === true) ? {
				content,
				message,
			}
			: 
			content
			return values as any
		})
		.catch(_ => {
			instance.delete();
			return undefined as any;
		});
};

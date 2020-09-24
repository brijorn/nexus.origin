import { Message, User } from "discord.js";

/**
 * Creates a prompt
 * @param message The message object
 * @param prompt The text for the prompt
 */
export default async (message: Message, member: User, prompt: any) => {
	const filter = (response: any) => response.author.id === message.author.id;

	const channel = await member.createDM();
	const instance = await channel.send(prompt);

	return channel
		.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first()!.content;

			return content;
		})
		.catch(_ => {
			instance.delete();
			return channel.send('You waited to long. (3m)');
		});
};

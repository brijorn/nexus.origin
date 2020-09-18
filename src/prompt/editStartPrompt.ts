import { Message } from "discord.js";

const embed = require('../functions/embed');
export default async (message: Message, prompt: any) => {
	// Makes sure that the bot will only listen to a message from the author
	const filter = (response: any) => response.author.id === message.author.id;
	// Instance now contains the prompt message
	const instance = await message.channel.send(prompt);

	// Collect the first message from the author, waiting 1 minute for a reaction
	return message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			// Content now contains the message from the author
			const content = collected.first()!.content;
			// Delete the response from the author
			// Delete the prompt message
			// Return the reply
			collected.first()!.delete();
			const obj = {
				content: content,
				message: instance,

			};
			return obj;
		})
		.catch(_ => {
			// If the author waited too long, delete the prompt
			instance.delete();

			// Return undefined so you can create a custom error message if no reaction was collected
			return;
		});
};
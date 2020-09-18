import { Message } from "discord.js";

export default async (message: Message, prompt: any, authorTime: any, promptTime: any, timeout = 180) => {
	timeout = timeout * 1000;
	// Makes sure that the bot will only listen to a message from the author
	const filter = (response: any) => response.author.id === message.author.id;
	// Instance now contains the prompt message
	const instance = await message.channel.send(prompt);

	// Collect the first message from the author, waiting 1 minute for a reaction
	return message.channel.awaitMessages(filter, { max: 1, time: timeout, errors: ['time'] })
		.then(collected => {
			// Content now contains the message from the author
			collected.first()!.delete();
			instance.delete({ timeout: promptTime * 1000 });
			const content = collected.first()!.content;
			// Delete the response from the author
			// Return the reply
			return content;
		})
		.catch(_ => {
			// If the author waited too long, delete the prompt
			instance.delete();

			// Return undefined so you can create a custom error message if no reaction was collected
			return undefined;
		});
};

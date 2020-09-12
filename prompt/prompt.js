module.exports = async (message, prompt) => {
	// Makes sure that the bot will only listen to a message from the author
	const filter = (response) => response.author.id === message.author.id;
	// Instance now contains the prompt message
	const instance = await message.channel.send(prompt);

	// Collect the first message from the author, waiting 1 minute for a reaction
	return message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {

			// Ifs
			const content = collected.first().content
			return content;
		})
		.catch(_ => {
			// If the author waited too long, delete the prompt
			instance.delete();

			return undefined;
		});
};

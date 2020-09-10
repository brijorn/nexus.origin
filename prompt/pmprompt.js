/**
 * Creates a prompt
 * @param message The message object
 * @param prompt The text for the prompt
 */
module.exports = async (message, prompt) => {
	const filter = response => response.author.id === message.author.id;

	const channel = await message.author.createDM();
	const instance = await channel.send(prompt);

	return channel
		.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first().content;
			const message = instance;
			return {
				content,
				message,
			};
		})
		.catch(_ => {
			instance.delete();
			return channel.send('You waited to long. (3m)');
		});
};

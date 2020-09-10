/**
 * Creates a prompt
 * @param message The message object
 * @param prompt The text for the prompt
 */
module.exports = async (message, member, prompt) => {
	const filter = response => response.author.id === message.author.id;

	const channel = await member.createDM();
	const instance = await channel.send(prompt);

	return channel
		.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first().content;

			return content;
		})
		.catch(_ => {
			instance.delete();
			return channel.send('You waited to long. (3m)');
		});
};

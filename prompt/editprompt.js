const embed = require('../functions/embed');
module.exports = async (message, msgToEdit, msg, type = 'regular') => {
	// Makes sure that the bot will only listen to a message from the author
	const filter = (response) => response.author.id === message.author.id;
	// Instance now contains the prompt message
	const instance = await msgToEdit.edit(msg);
	// Collect the first message from the author, waiting 1 minute for a reaction
	return message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			// Content now contains the message from the author
			const content = (type === 'image') ? collected.first().attachments.first().url : collected.first().content;
			// Delete the response from the author
			// Delete the prompt message
			if (type !== 'image') {
				collected.first().delete();
			}
			// Return the reply
			if (type === 'lower') {
				const lower = content.toLowerCase();
				return lower;
			}
			else {
				return content;
			}
		})
		.catch(_ => {
			// If the author waited too long, delete the prompt
			instance.delete();
			// Return undefined so you can create a custom error message if no reaction was collected

			return message.channel.send('Prompt has timed out after 3 minutes.');
		});
};
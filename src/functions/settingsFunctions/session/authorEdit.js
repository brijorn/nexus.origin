const embed = require('../../embed');
const config = require('../../../config.json');
const delprompt = require('../../../prompt/delprompt');
module.exports = async (authorMenu, message, guild) => {
	const validOptions = ['author name', 'author icon', 'enabled', 'close'];
	let closed = false;
	const filter = (response) => response.author.id === message.author.id;
	while (closed !== true) {
		await message.channel.awaitMessages(filter, { max: 1, time: 180000 })
			.then(async collected => {
				if (collected.first() === undefined) return;
				const msg = collected.first().content;
				const content = msg.toLowerCase();
				if (!validOptions.includes(content)) return message.channel.send('Invalid Option');
				if (content === 'author name') {
					collected.first().delete();
					const infoprompt = embed('none', `What would you like to set the Author Name to?\n\n {{MessageAuthor.username}} will be replaced with the username of the person running the command EG: ${message.author.username}#${message.author.discriminator}\n {{MessageAuthor}} will be replaced with the nickname of the person running the command, EG: ${message.author.displayName}`, guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = authorMenu.embeds[0];
					newEmbed.fields[2].value = information;
					return authorMenu.edit(newEmbed);
				}
				if (content == 'author icon') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like to set the Author Icon to? Please Provide a valid URL or use the placeholder {{MessageAuthor.Icon}} to use the profile of the person running the command.', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = authorMenu.embeds[0];
					newEmbed.fields[1].value = information;
					return authorMenu.edit(newEmbed);
				}
				if (content === 'enabled') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like to set enabled to?\nOptions: `true` or `false`', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const infolower = information.toLowerCase();
					if (infolower !== 'true' && infolower !== 'false') return message.channel.send(embed('none', 'Invalid Option for question.', guild));
					const newEmbed = authorMenu.embeds[0];
					newEmbed.fields[0].value = infolower;
					return authorMenu.edit(newEmbed);
				}
				if (content === 'close') {
					collected.first().delete();
					closed = true;
				}
				collected.delete();

			});
	}
	return authorMenu;
};
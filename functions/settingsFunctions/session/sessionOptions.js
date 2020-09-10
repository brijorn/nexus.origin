const embed = require('../../embed');
const delprompt = require('../../../prompt/delprompt');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');
module.exports = async (message, mainMenu, guild) => {
	const validOptions = ['session name', 'prompt title', 'author', 'thumbnail', 'image', 'footer', 'messages'];
	let done = false;
	let cancel = false;
	const filter = (response) => response.author.id === message.author.id;
	let authorinfo = new MessageEmbed()
		.setTitle('Author Menu')
		.setDescription('Respond with the name of a field to configure it, to disable configure the Enabled field to false.')
		.addField('Enabled', `${config.disabled} False`)
		.addField('Author Icon', 'none')
		.addField('Author Name', '{{MessageAuthor.username}} {{MessageAuthor}} are valid placeholders')
		.setFooter('When finished say close');
	let messageinfo = new MessageEmbed()
		.setTitle('Message Menu')
		.addField('Enabled One', 'false', true)
		.addField('Prompt One', 'None', true)
		.addField('Type One', 'None', true)
		.addField('Enabled Two', 'false', true)
		.addField('Prompt Two', 'None', true)
		.addField('Type Two', 'None', true)
		.addField('Enabled Three', 'false', true)
		.addField('Prompt Three', 'None', true)
		.addField('Type Three', 'None', true)
		.setFooter('When finished say close');
	while (!done === true) {
		await message.channel.awaitMessages(filter, { max: 1, time: 180000 })
			.then(async collected => {
				if (collected.first() === undefined) return;
				const msg = collected.first().content;
				const content = msg.toLowerCase();

				if (content === 'session name') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like the session name to be?', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[0].value = information;
					return mainMenu.edit(newEmbed);
				}
				if (content === 'message title') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like the message title to be?', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[1].value = information;
					mainMenu.edit(newEmbed);
				}
				if (content === 'author') {
					collected.first().delete();
					const authorEdit = require('./authorEdit');
					message.channel.send(authorinfo).then(async msg => {
						const newAuthorInfo = await authorEdit(msg, message, guild);
						authorinfo = newAuthorInfo.embeds[0];
						newAuthorInfo.delete({ timeout: 1000 });
					});
				}
				if (content === 'message description') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like the messsage description to be?\n\nTo use content from a message use {{Prompt <num>}} eg: {{Prompt One}}', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[2].value = information;
					mainMenu.edit(newEmbed);
				}
				if (content === 'image') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like to set the image to? Please give a Image URL.', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[5].value = information;
					mainMenu.edit(newEmbed);
				}
				if (content === 'thumbnail') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like to set the thumbnail to? Please give a Image URL.', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[4].value = information;
					mainMenu.edit(newEmbed);
				}
				if (content === 'footer') {
					collected.first().delete();
					const infoprompt = embed('none', 'What would you like to set the footer to?', guild);
					const information = await delprompt(message, infoprompt, 5, 5);
					const newEmbed = mainMenu.embeds[0];
					newEmbed.fields[6].value = information;
					mainMenu.edit(newEmbed);
				}
				if (content === 'messages') {
					collected.first().delete();
					const messageEdit = require('./messageEdit');
					message.channel.send(messageinfo).then(async msg => {
						const newMessageInfo = await messageEdit(msg, message, guild);
						console.log(newMessageInfo);
						messageinfo = newMessageInfo.embeds[0];
						console.log(messageinfo);
						newMessageInfo.delete({ timeout: 1000 });
					});
				}
				if (content === 'cancel') {
					collected.first().delete();
					const conmsg = embed('none', 'Are you sure you want to cancel creation of a new session?', guild);
					const confirm = await delprompt(message, conmsg, 5, 5);
					conlow = confirm.toLowerCase();
					if (conlow !== 'y' && conlow !== 'yes') return message.channel.send(embed('none', 'Cancelling cancelled? Weird huh.', guild));
					done = true;
					cancel = true;
					mainMenu.delete({ timeout: 2000 });
					return message.channel.send(embed('none', 'Creation Cancelled.', guild));
				}
				if (content === 'done') {
					const conmsg = embed('none', 'Are you sure you are finished creating the session? This may be configured later.', guild);
					const confirm = await delprompt(message, conmsg, 5, 5);
					const conlow = confirm.toLowerCase();
					const checker = await message.channel.send(embed('none', 'Checking Information', guild));
					if (conlow !== 'y' && conlow !== 'yes') return message.channel.send(embed('none', 'I guess were not done yet?', guild));
					if (mainMenu.embeds[0].fields[0].value === 'N/A') return checker.edit(embed('none', 'Finishing cancelled, Session name is not given.', guild));
					if (guild.sessions.sessions.find(sess => sess.name === mainMenu.embeds[0].fields[0].value)) return checker.edit(embed('none', 'Finishing cancelled, You already have a session with that name.', guild));
					if (mainMenu.embeds[0].fields[1].value === 'N/A') return checker.edit(embed('none', 'Finishing cancelled, Message Title is not given.', guild));
					if (mainMenu.embeds[0].fields[2].value === 'N/A') return checker.edit(embed('none', 'Finishing cancelled, Message Description is not given.', guild));
					const msginfo = messageinfo;
					if (msginfo.fields[0].value === 'false' && msginfo.fields[3].value === 'false' && msginfo.fields[6].value === 'false') return checker.edit(embed('none', 'Finishing cancelled, no messages are enabled.', guild));
					checker.delete({ timeout: 1000 });
					done = true;
					cancel = false;
				}
			});
	}
	console.log(cancel);
	return {
		authorinfo,
		messageinfo,
		done,
		cancel,
	};
};
const embed = require('../../functions/embed');
const editStartPrompt = require('../../prompt/editStartPrompt');

module.exports = async (bot, message, args, guild) => {
	if (message.author.id !== message.guild.owner.id) return embed('Permissions Error', 'Only the owner of the server can change the prefix', guild);
	if (args[1]) {
		guild.prefix = args[1];
		guild.markModified('prefix');
		await guild.save();
		message.channel.send(embed('none', `Successfully set the prefix to \`${args[1]}\``, guild));
	}
	if (!args[1]) {
		const ask = await editStartPrompt(message, embed('Prefix', 'What would you like to se the prefix to?\n\nRespond **cancel** to cancel', guild));
		if (ask.content.toLowerCase() === 'cancel') return ask.message.delete({ timeout : 2 });
		guild.prefix = ask.content;
		guild.markModified('prefix');
		await guild.save();
		ask.message.edit(embed('none', `Successfully set the prefix to \`${ask.content}\``, guild));
	}
};
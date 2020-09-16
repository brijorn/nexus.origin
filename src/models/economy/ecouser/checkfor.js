const users = require('./user');
const embed = require('../../../functions/embed');
const { MessageEmbed } = require('discord.js');
module.exports = async function(userId, message) {
	let user = await users.findOne({ userId: userId });
	if (!user) {
		const msg = new MessageEmbed()
			.setDescription('You have made it to the Citadel of the galaxy, The Nexus.' +
        'Here you are but a poor little insect, you must earn money to have any real worth.' +
        'I am willing to make you a profile, just run the command `createdata`.');
		message.channel.send(msg);
		return user = undefined;
	}
	return user;
};
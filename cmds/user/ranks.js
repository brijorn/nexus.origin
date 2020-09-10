const Discord = require('discord.js');
const fetch = require('node-fetch');
const guildModel = require('../../models/guildModel/guild');
const embed = require('../../functions/embed');
const verificationModel = require('../../models/verificationModel/verification');
const ownedAssets = require('../../functions/rankFunctions/ownedAssets');
module.exports.run = async (bot, message, args) => {
	const guild = await guildModel.findOne({ guildID: message.guild.id });
	if (guild.rankBinds.length < 0) return message.channel.send('none', 'Error: This guild has no rank binds setup.');
	const verification = await verificationModel.findOne({ userID: message.author.id });
	const userID = verification.primaryAccount;
	const checking = await message.channel.send(embed('Searching', 'Searching for assets you own', guild));
	const ranks = await ownedAssets(bot, message, guild, userID);
	checking.edit(ranks);
};


module.exports.help = {
	name: 'ranks',
	module: 'user',
	description: 'Show all rank binds in the group and the ones available to you',
};
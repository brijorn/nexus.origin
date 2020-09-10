const embed = require('../embed');
const User = require('../../models/userModel/user');
const config = require('../../config.json');
const badgeformater = require('../../functions/profileFunc/badges');
const lookup = require('../../functions/lookupFunction');
const verification = require('../../models/verificationModel/verification');
const { MessageEmbed } = require('discord.js');

const memberparse = require('../../lib//parse').member;
module.exports = async (bot, message, args, guild, mentioned) => {

	mentioned = await memberparse(message, args);
	if (!await verification.findOne({ userID: mentioned.id })) return message.channel.send(embed('none', 'The user you mentioned is not verified.', guild, config.failure));
	const user = await verification.findOne({ userID: mentioned.id });

	if (await User.exists({ userID: message.author.id }) === false) return message.channel.send(embed('none', 'The user you mentioned does not have a profile.', guild, config.failure));
	const profile = await User.findOne({ userID: mentioned.id });

	const badges = await badgeformater(profile);
	let description = `${badges}`;
	// Get and set the presence if enabled
	const presence = require('./presence');
	if (profile.presence && profile.presence === true) description = description + `\n**Presence**: ${await presence(user.primaryAccount)}`;

	if (profile.status && profile.status !== 'none') description = description + `\n**Status**: ${profile.status}`;

	const profileinfo = new MessageEmbed()
		.setTitle('Origin Profile')
		.setAuthor(`${mentioned.user.username}`, mentioned.user.avatarURL(), `https://www.roblox.com/users/${user.primaryAccount}/profile`)
		.addField('Roblox Account', user.primaryAccount, true)
		.setColor('#36393E')
		.setFooter(`To configure your profile run ${guild.prefix}profile config.`, guild.embed.footerlogo);
	// Check if they have a profile and they didn't set it to none.
	if (profile.profileDesc && profile.profileDesc.toLowerCase() !== 'none') description = description + `\n${profile.profileDesc}`;
	profileinfo.setDescription(description);
	if (profile.primaryGroup === true) profileinfo.addField('Primary Group', await lookup(user.primaryAccount, 'primary'), true);
	// Check if they set a thumbnail and if it isn't none
	if (profile.thumbnail && profile.thumbnail !== 'none') profileinfo.setThumbnail(profile.thumbnail);
	// Check if the guild has points if so add to their profile
	if (guild.points && guild.points.enabled === true) {
		await guild.points.systems.forEach(each => {
			if (each.users.find(theauser => theauser.userId === parseInt(user.primaryAccount))) {
				const userp = each.users.find(daoneuser => daoneuser.userId === parseInt(user.primaryAccount));
				profileinfo.addField(each.name, `${userp.points} ${each.currency}`, true);
			}
			else {
				return;
			}
		});
	}
	// Send the profile embed and remove the loading reaction
	message.reactions.cache.map(each => each.remove());
	const profilesend = await message.channel.send(profileinfo);
};
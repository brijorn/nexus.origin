const Discord = require('discord.js');
const embed = require('../embed');
const fetch = require('node-fetch');
const rbx = require('noblox.js');
const usr = require('../../lib/roblox/user/index');
const verificationModel = require('../../models/verificationModel/verification');
module.exports = async (bot, message, guild, type = 'reg', extra = 'N/A') => {
	const member = (type === 'reg') ? message.member : extra;
	const id = (type === 'reg') ? message.author.id : extra.id;
	const guildLoc = (type === 'reg') ? message.guild : extra.guild;
	const rolesAdded = [];
	const addedRole = '';
	const rolesRemoved = [];
	const currentrole = undefined;
	// Highest Role Information

	let highestroleobj = '';
	let highestrolehier = 0;
	let highestrolename = 'Guest';
	let highestroletype = '';

	async function setHighest(obj, asset = false, name) {
		highestrolehier = obj.hierarchy;
		highestroleobj = obj;
		if (asset === true) {highestrolename = await rbx.getProductInfo(obj.assetId); highestroletype = 'asset';}
		if (asset === false) {highestrolename = name; highestroletype = 'rank';}
		return;
	}
	if (guild.verificationSettings.verifiedRole !== 'none') {
		if (!member.roles.cache.has(guild.verificationSettings.verifiedRole)) {
			member.roles.add(guild.verificationSettings.verifiedRole);
			rolesAdded.push(member.guild.roles.cache.get(guild.verificationSettings.verifiedRole).name);
		}
	}
	let rouser = await verificationModel.findOne({ userID: id });
	rouser = rouser.primaryAccount;

	// Check if they own any assets
	async function ownedAssets(robloxUser, user, array) {
		for (i = 0; i < array.length; i++) {
			const asset = array[i];
			const owns = await usr.ownsAsset(robloxUser, asset.assetId);
			if (owns === true) {
				if (asset.hierarchy > highestrolehier) setHighest(asset, true);
				asset.roles.forEach(r => {
					if (guildLoc.roles.cache.get(r)) {
						if (!user.roles.cache.find(o => o.id === r)) {
							try { user.roles.add(r); }
							catch { return message.channel.send(embed('Error', 'Failed to give you a assetbind role, this is most likely a permissions erorr.', guild, 'failure', false, true));}
							rolesAdded.push(guildLoc.roles.cache.get(r)).name;
						}
					}
				});
			}
		}
	}
	if (guild.assetBinds.length > 0) {
		await ownedAssets(rouser, member, guild.assetBinds);
	}
	if (guild.gamepassBinds.length > 0) {
		await ownedAssets(rouser, member, guild.gamepassBinds);
	}
	// Here begins Shit Hole

	const currentRank = 0;
	for (b = 0; b < guild.roleBinds.length; b++) {
		const obj = guild.roleBinds[b];
		const roles = obj.binds;
		const rank = await rbx.getRankInGroup(obj.id, rouser);
		const rankname = await rbx.getRankNameInGroup(obj.id, rouser);
		const objrank = roles.find(a => a.rank === rank);
		if (objrank) {
			if (objrank.hierarchy > highestrolehier) await setHighest(objrank, false, rankname);
			// Add all roles in objrank array
			for (i = 0;i < objrank.roles.length;i++) {
				const role = objrank.roles[i];
				if (!member.roles.cache.get(role)) {
					try {
						member.roles.add(role);
						rolesAdded.push(guildLoc.roles.cache.get(role).name);
					}
					catch {
						message.channel.send(embed('Error', `Failed to give you one of the following roles: ${objrank.roles.map(e => `<@&${e}>`).join(', ')}, If you can, make sure this role exists.`, guild, 'failure', false, true));
					}
				}
			}
			// Remove all other  roles from another rank :flushed:
			const toRemove = roles.find(r => r.roles.find(o => member.roles.cache.has(o) === true));
			if (toRemove.roles.length > 0) {
				for (i = 0; i < toRemove.roles.length > 0; i++) {
					const role = toRemove.roles[i];
					if (!objrank.roles.includes(role)) {
						try {
							member.roles.remove(role);
							rolesRemoved.push(guildLoc.roles.cache.get(role).name);
						}
						catch {
							message.channel.send(embed('Error', 'Failed to remove Roles, this is usually a permissions error.', guild, 'failure', false, true));
						}
					}
				}
			}
		}
	}
	const roleInfo = {
		type: highestroletype,
		name: highestrolename,
		obj: highestroleobj,

	};
	return {
		rolesAdded,
		rolesRemoved,
		roleInfo,
	};
};
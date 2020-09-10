const Discord = require('discord.js');
const embed = require('../embed');
const config = require('../../config.json');
const fetch = require('node-fetch');
const guildModel = require('../../models/guildModel/guild');

module.exports = async (bot, message, msgToEdit, groupid, guild) => {
	function deletableRole(role) {
		const answer = role.editable && !role.managed;
		return answer;
	}
	function compare(a, b) {
		let comp = 0;
		if (a.rank > b.rank) {
			return comp = -1;
		}
		if (b.rank > a.rank) {
			return comp = 1;
		}
	}
	// Delete Old Main Setting
	let oldbinds = guild.roleBinds.find(o => o.main === true || o.id === groupid);
	oldbinds = {};
	const newbindsObj = {
		id: groupid,
		main: true,
		binds: [],
	};
	guild.markModified('roleBinds');
	await guild.save();
	const check = await message.guild.roles.cache.forEach(async role => {
		if (!deletableRole(role)) return;
		// @everyone
		if (role.id === message.guild.id) return;
		// Moderation
		if (guild.moderation.mutedrole === role.id) return;
		if (guild.roleBinds.find(o => o.binds.find(p => p.roleId === role.id))) return;
		if (guild.moderation.modrole.find(o => {
			const split = o.match(/\d+/)[0];
			return (split === role.id);
		})) return;
		// Assets
		if (guild.assetBinds.find(obj => obj.roleId === role.id)) return;
		if (guild.gamepassBinds.find(obj => obj.roleId === role.id)) return;
		// Verification
		if (guild.verificationSettings.verifiedRole === role.id) return;
		if (guild.verificationSettings.unverifiedRole === role.id) return;
		msgToEdit.edit(embed('none', `Deleting role \`${role.name}\``, guild));
		const del = role.delete();
		del.catch(console.error);
	});

	const search = await fetch(`https://groups.roblox.com/v1/groups/${groupid}/roles`).then(response => response.json())
		.then(bod => {
			const body = bod.roles;
			const slicer = body.splice(0, 1);
			body.sort(compare);
			const roles = body;
			roles.forEach(async element => {
				const cooldescriptionthing = embed('none', `Creating role \`${element.name}\``, guild);
				msgToEdit.edit(cooldescriptionthing);
				message.guild.roles.create({

					data: {
						name: element.name,
					},
					reason: 'Creating',
				})
        	    .then(async darole => {
						const RoleObj = {
							id: element.id,
							rank: element.rank,
							nickname: 'default',
							roles: [darole.id],
							hierarchy: 1,
						};

						newbindsObj.binds.push(RoleObj);
					});
			});
			return roles.length;
		});
	oldbinds = newbindsObj;
	guild.markModified('roleBinds');
	await guild.save();
	return search;
};

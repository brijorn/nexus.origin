const config = require('../config.json');
const embed = require('../functions/embed');
module.exports = async (message, guild) => {
	let good = true;
	const Perm = {
		gOwnerOnly: embed('Permissions', 'Only the guild owner can run this command.', guild, config.failure),
		OwnerOnly: embed('Permissions', 'Only the guild owner or someone with `owner` permission with the bot can run this.', guild, config.failure),
		AdminOnly: function() {
			message.reply(embed('Permissions', 'Only the guild owner or someone with `owner` or `admin` permission with the bot can run this.', guild, config.failure));
		},
	};
	const Dis = {
		cdisabled: function(name) {
			message.channel.send(embed(`${name} Disabled`, 'This command is not setup or currently disabled in this guild', guild));
		},
	};
	const CheckFor = {
		all: async function(sendmsg = true) {
			const isGuildOwner = message.author.id === message.guild.owner.id;
			const isOwner = guild.permissions.owners.includes(message.author.id);
			const isAdmin = guild.permissions.admins.includes(message.author.id);
			if (isGuildOwner === false && isOwner === false && isAdmin === false) {
				if (sendmsg = true) Perm.AdminOnly();
				return good = false;
			}
		},
		enabledMod: function(dir, name) {
			if (!guild[dir] || guild[dir].enabled === false) {
				Dis.cdisabled('Points');
				return good = false;
			}
		},
		robloxtoken: function(dir, name) {
			if (!guild.robloxToken) {
				message.reply(embed('No .ROBLOSECURITY', `There is no Roblox Token set for this guild which is required for this command to work. You can set one with \`${guild.prefix}token (WE WILL NEVER SEE THIS.)`));
				return good = false;
			}
		},
	};
	const moderation = {
		moderationRoles: function() {
			const modroles = guild.moderation.modrole;

			let clear = false;
			for (i = 0; i < modroles.length && clear === false; i++) {
				const role = modroles[i];
				if (role.startsWith('greaterthan')) {
					let val = role.split('(')[1];
					val = val.substring(0, (val.length) - 1);
					val = message.guild.roles.cache.get(val);
					if (!message.guild.roles.cache.get(val)) return;
					if (message.member.roles.cache.find(e => {
						if (e.position >= val.position) clear = true;
					}));
				}
				else if (!message.member.roles.cache.get(role)) {
					return;
				}
				else {
					return clear = true;
				}
			}
			if (clear === false) message.reply(embed('none', 'You do not have permission to run this command', guild, config.failure));
			return good = (clear === true) ? true : false;
		},
	};
	return {
		Perm,
		Dis,
		CheckFor,
		good,
		moderation,
	};
};
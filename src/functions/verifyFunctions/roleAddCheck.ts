import embed from '../embed';
import noblox, { getProductInfo } from 'noblox.js';
import { CheckOwnership } from '../../lib/roblox/user/index';

import { Client, Message } from 'discord.js';
import { VerificationSettings, VerificationUser, GuildSettings } from '@lib/origin';
export default async (bot: Client, message: Message, guild: GuildSettings, user: VerificationUser, verification: VerificationSettings, type: string = 'reg', extra: any = 'N/A') => {
	const member = (type === 'reg') ? message.member : extra;
	const id = (type === 'reg') ? message.author.id : extra.id;
	const guildLoc = (type === 'reg') ? message.guild : extra.guild;

	const rolesAdded = [];
	const addedRole = '';
	const rolesRemoved = [];
	const currentrole = undefined;
	// Highest Role Information

	let highestroleobj: any = {};
	let highestrolehier = 0;
	let highestrolename = 'Guest';
	let highestroletype = '';

	async function setHighest(obj: any, asset: any = false, name?: any) {
		highestrolehier = obj.hierarchy;
		highestroleobj = obj;
		if (asset === true) {
			highestroleobj = await noblox.getProductInfo(obj.assetId); 
			highestroletype = 'asset';
		}
		if (asset === false) {highestrolename = name; highestroletype = 'rank';}
		return;
	}
	if (verification.verified_role) {
		if (!member.roles.cache.has(verification.verified_role)) {
			try {
			member.roles.add(verification.verified_role);
			rolesAdded.push(member.guild.roles.cache.get(verification.verified_role).name);
			}
			catch { return }
		}
	}
	const rouser = (await new VerificationUser().get(id)).primary_account;
	// Check if they own any assets
	async function ownedAssets(robloxUser: any, user: any, array: any[]) {
		for (let i = 0; i < array.length; i++) {
			const asset = array[i];
			const owns: Boolean = false
			if (owns === true) {
				if (asset.hierarchy > highestrolehier) setHighest(asset, true);
				asset.roles.forEach((r: any) => {
					if (guildLoc.roles.cache.get(r)) {
						if (!user.roles.cache.find((o: any) => o.id === r)) {
							try { user.roles.add(r); }
							catch { return message.channel.send(embed('Error', 'Failed to give you a assetbind role, this is most likely a permissions erorr.', guild, 'failure', false, true));}
							rolesAdded.push(guildLoc.roles.cache.get(r).name);
						}
					}
				});
			}
		}
	}
	if (verification.role_binds.length > 0) {
		await ownedAssets(rouser, member, verification.role_binds);
	}
	if (verification.role_binds.length > 0) {
		await ownedAssets(rouser, member, verification.role_binds);
	}
	// Here begins Shit Hole

	const currentRank = 0;
	for (let b = 0; b < verification.role_binds.length; b++) {
		const obj = verification.role_binds[b];
		const roles = obj.binds;
		const rank = await noblox.getRankInGroup(obj.id, rouser as any);
		const rankname = await noblox.getRankNameInGroup(obj.id, rouser as any);
		const objrank = roles.find((a: any) => a.rank === rank);
	
		if (objrank) {
			if (objrank.hierarchy > highestrolehier) await setHighest(objrank, false, rankname);
			// Add all roles in objrank array
			for (let i = 0;i < objrank.roles.length;i++) {
				const role = objrank.roles[i];
				if (!member.roles.cache.get(role)) {
					try {
						member.roles.add(role);
						rolesAdded.push(guildLoc.roles.cache.get(role).name);
					}
					catch {
						let v = objrank.roles as any
						v = v.map((e: any) => `<@&${e}>`).join(', ')
						message.channel.send(embed('Error', `Failed to give you one of the following roles: ${v}, If you can, make sure this role exists.`, guild, 'failure', false, true));
					}
				}
			}
			// Remove all other  roles from another rank :flushed:
			const toRemove = roles.find((r: any) => r.roles.find((o: any) => member.roles.cache.has(o) === true));
			if (toRemove && toRemove.roles.length > 0) {
				for (let i = 0; i < toRemove.roles.length; i++) {
					const role = toRemove.roles[i];
					if (!objrank.roles.includes(role as never)) {
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
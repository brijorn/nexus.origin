import embed from '../embed';
import noblox, { getProductInfo } from 'noblox.js';
import { ownsAsset } from '../../lib/roblox/user/index';
import { Client, Message } from 'discord.js';
import GuildSettings from '../../db/guild/types';
import { GetUser } from '../../db/verification/user/schema';
import { VerificationSettings } from '../../db/verification/types';
export default async (bot: Client, message: Message, guild: GuildSettings, verification: VerificationSettings, type: string = 'reg', extra: any = 'N/A') => {
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
	if (verification.VerifiedRole) {
		if (!member.roles.cache.has(verification.VerifiedRole)) {
			try {
			member.roles.add(verification.VerifiedRole);
			rolesAdded.push(member.guild.roles.cache.get(verification.VerifiedRole).name);
			}
			catch { return }
		}
	}
	const rouser = (await GetUser(id)).PrimaryAccount;

	// Check if they own any assets
	async function ownedAssets(robloxUser: any, user: any, array: any[]) {
		for (let i = 0; i < array.length; i++) {
			const asset = array[i];
			const owns = await ownsAsset(robloxUser, asset.assetId);
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
	if (verification.AssetBinds.length > 0) {
		await ownedAssets(rouser, member, verification.AssetBinds);
	}
	if (verification.GamePassBinds.length > 0) {
		await ownedAssets(rouser, member, verification.GamePassBinds);
	}
	// Here begins Shit Hole

	const currentRank = 0;
	for (let b = 0; b < verification.RoleBinds.length; b++) {
		const obj = verification.RoleBinds[b];
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
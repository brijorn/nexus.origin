import embed from "../embed";
import noblox, { getProductInfo } from "noblox.js";
import { CheckOwnership } from "../../lib/util/roblox/user/index";

import { Client, Guild, GuildMember, Message, Role } from "discord.js";
import {
	VerificationSettings,
	VerificationUser,
	GuildSettings,
	GroupBinds, AssetBindType
} from "../../typings/origin";
import OriginMessage from "../../lib/extensions/OriginMessage";
export default async (
	member: GuildMember,
	guild: Guild,
	user: VerificationUser,
	verification: VerificationSettings,
	message?: OriginMessage
): Promise<RoleCheck|undefined> => {
	const rolesAdded: string[] = [];
	const rolesRemoved: string[] = [];
	const addedRole = "";
	const missingRoles: string[] = [];
	const currentrole = undefined;
	// Highest Role Information

	let highestroleobj: Record<string, string> = {};
	let highestrolehier = 0;
	let highestrolename = "Guest";
	let highestroletype = "";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function setHighest(obj: Record<string, any>, asset: string | boolean = false, name?: string) {
		highestrolehier = parseInt(obj.hierarchy);
		highestroleobj = obj;
		if (asset === true) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			highestroleobj = await noblox.getProductInfo(parseInt(obj.assetId)) as any;
			highestroletype = "asset";
		}
		if (asset === false) {
			highestrolename = (name) ? name : highestrolename;
			highestroletype = "rank";
		}
		return;
	}
	if (verification.verified_role) {
		if (!member?.roles.cache.has(verification.verified_role)) {
			try {
				member?.roles.add(verification.verified_role);
				const role = member.guild.roles.cache.get(verification.verified_role)?.name
				if (!role) {
					if (message) message.error(`Could not find the verification role: ${verification.verified_role}`);
					return;
				}
				else {
					rolesAdded.push(
						role
					);
				}
			} catch {
				return;
			}
		}
	}
	// Check if they own any assets
	async function ownedAssets(robloxUser: VerificationUser, user: GuildMember, array: AssetBindType[]) {
		for (let i = 0; i < array.length; i++) {
			const asset = array[i];
			const owns = false;
			if (owns as boolean == true) {
				if (asset.hierarchy > highestrolehier) setHighest(asset, true);
				asset.roles.forEach((r) => {
					if (guild.roles.cache.get(r)) {
						if (!user.roles.cache.find((o: Role) => o.id === r)) {
							const role = guild.roles.cache.get(r)
							if (!role) return missingRoles.push(r) 
							try {
								user.roles.add(role);
							} catch {
								if (message) message.error("Failed to give you a assetbind role, this is most likely a permissions erorr.")
								else return
							}
							if (!role) {
								missingRoles.push(r)
							}
							else {
								rolesAdded.push(role.name);
							}
						}
					}
				});
			}
		}
	}
	if (verification.role_binds.length > 0) {
		await ownedAssets(user, member, verification.asset_binds);
	}
	if (verification.role_binds.length > 0) {
		await ownedAssets(user, member, verification.asset_binds);
	}
	// Here begins Shit Hole

	const currentRank = 0;
	for (let b = 0; b < verification.role_binds.length; b++) {
		const obj = verification.role_binds[b];
		const roles = obj.binds;
		const rank = await noblox.getRankInGroup(obj.id, user.primary_account);
		const groupRole = await noblox.getRole(obj.id, rank)
		const rankName = groupRole.name
		const objrank = obj.binds.find(o => o.id === groupRole.id)

		if (objrank) {
			if (objrank.hierarchy > highestrolehier)
				await setHighest(objrank, false, rankName);
			// Add all roles in objrank array
			for (let i = 0; i < objrank.roles.length; i++) {
				const role = objrank.roles[i];
				if (!member.roles.cache.get(role)) {
					try {
						member.roles.add(role);
						const givenRole = guild.roles.cache.get(role)?.name
						if (!givenRole) missingRoles.push(role)
						else rolesAdded.push(givenRole);
					} catch {
						const mappedRole= objrank.roles.map((e) => `<@&${e}>`).join(", ");
						if (message) {
							message.error(`Failed to give you one of the following roles: ${mappedRole}, If you can, make sure this role exists.`);
							return
						}
						else return
					}
				}
			}
			// Remove all other  roles from another rank :flushed:
			const toRemove = roles.find((r) =>
				r.roles.find((o) => member.roles.cache.has(o) === true)
			);
			if (toRemove && toRemove.roles.length > 0) {
				for (let i = 0; i < toRemove.roles.length; i++) {
					const role = toRemove.roles[i];
					if (!objrank.roles.includes(role)) {
						try {
							const removedRole = guild.roles.cache.get(role)
							if (!removedRole) missingRoles.push(role);
							else {
								member.roles.remove(removedRole);
								rolesRemoved.push(removedRole.name);
							}
						} catch {
							if (message) {
								message.error("Failed to remove Roles, this is usually a permissions error.")
							}
							else return
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
	const info: RoleCheck = {
		rolesAdded: rolesAdded,
		rolesRemoved: rolesRemoved,
		roleInfo: roleInfo
	}
	return info
};

interface RoleCheck {
	rolesAdded: Array<string>
	rolesRemoved: Array<string>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	roleInfo: Record<string, any>
}
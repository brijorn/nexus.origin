import embed from "../embed";
import noblox, { getOwnership, getProductInfo } from "noblox.js";

import { Client, Guild, GuildMember, Message, Role, User } from "discord.js";
import {
	VerificationSettings,
	VerificationUser,
	GuildSettings,
	GroupBinds, AssetBindType
} from "../../typings/origin";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
export default async (
	member: GuildMember,
	guild: Guild,
	user: VerificationUser,
	verification: VerificationSettings,
	message?: OriginMessage
): Promise<RoleCheck> => {
	const rolesAdded: string[] = [];
	const rolesRemoved: string[] = [];
	const errors: string[] = []
	const addedRole = "";
	const missingRoles: string[] = [];
	const currentrole = undefined;
	// Highest Role Information

	let highestroleobj: Record<string, string> = {};
	let highestrolehier = 0;
	let highestrolename = "Guest";
	let highestroletype = "";
	let highestolenickname = '';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function setHighest(obj: Record<string, any>, asset: string | boolean = false, name?: string) {
		highestrolehier = parseInt(obj.hierarchy);
		highestroleobj = obj;
		highestolenickname = obj.nickname
		if (asset === true) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			highestroleobj = await noblox.getProductInfo(parseInt(obj.assetId)) as any;
			highestroletype = "asset";
		}
		if (asset === false) {
			highestrolename = (name) ? name : highestrolename;
			highestroletype = "rank";
		}
	}
	console.log(verification.verified_role)
	if (verification.verified_role) {
		if (!member?.roles.cache.has(verification.verified_role)) {
			console.log('here')
			const role = member.guild.roles.cache.get(verification.verified_role)
			console.log(role)
			if (role) {
				member?.roles.add(role);
				rolesAdded.push(role.name)
			}
			else errors.push(`Could not find the verified role. RoleID: ${verification.verified_role}`)
		}
	}
	// Check if they own any assets
	async function ownedAssets(robloxUser: VerificationUser, user: GuildMember, array: AssetBindType[]) {
		for (let i = 0; i < array.length; i++) {
			const asset = array[i];
			const owns = await getOwnership(robloxUser.primary_account, asset.assetId)
			if (owns == true) {
				if (asset.hierarchy > highestrolehier) setHighest(asset, true);
				asset.roles.forEach((r) => {
					const role = guild.roles.cache.get(r)
					if (role) {
						if (!user.roles.cache.get(role.id)) {
							user.roles.add(role)
							rolesAdded.push(role.name)
						}
					}
					else errors.push(`Failed to give the role \`${r}\` for the asset ${asset.assetId}`)
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
		const objrank = obj.binds.find(bind => bind.id == Object.entries(groupRole)[3][1])
		if (objrank) {
			if (objrank.hierarchy > highestrolehier)
				await setHighest(objrank, false, rankName);
			// Add all roles in objrank array
			for (let i = 0; i < objrank.roles.length; i++) {
				const roleId = objrank.roles[i];
				const role = member.guild.roles.cache.get(roleId)
				if (role) {
					if (member.roles.cache.get(role.id)) continue;

					member.roles.add(role)
					rolesAdded.push(role.id)
				}
				else {
					errors.push(`Could not find the role ${roleId} in the roles of rank ${rank} in group ${obj.id}. Main Group: ${obj.main}`)
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
							else continue;
						}
					}
				}
			}
		}
	}
	const roleInfo = {
		type: highestroletype,
		name: highestrolename,
		nickname: highestolenickname,
		obj: highestroleobj,
	};
	const info: RoleCheck = {
		rolesAdded: rolesAdded,
		rolesRemoved: rolesRemoved,
		errors: errors,
		roleInfo: roleInfo
	}
	return info
};

interface RoleCheck {
	rolesAdded: Array<string>
	rolesRemoved: Array<string>
	errors: Array<string>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	roleInfo: Record<string, any>
}
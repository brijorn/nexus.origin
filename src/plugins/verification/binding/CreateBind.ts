/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	NewAssetBindInterface,
	GuildSettings,
	AssetBindType,
	NewRoleBindInterface,
	GroupBinds} from "../../../typings/origin";
import { Role } from "noblox.js";
import { Role as DiscordRole } from 'discord.js'
import { Client, Message } from "discord.js";
import embed from "../../../functions/embed";
import { getProductInfo, ProductInfo } from "noblox.js";
import { VerificationSettings } from "../../../handlers/VerificationHandler";
import OriginClient from "../../../lib/OriginClient";
import { OriginMessage } from "../../../lib/extensions/OriginMessage";
export async function NewAssetBind(
	bot: OriginClient,
	message: OriginMessage,
	guild: GuildSettings,
	verification: VerificationSettings,
	newBindObject: NewAssetBindInterface
): Promise<void|Message> {
	// Check if the roles Exist
	const [roles, missingRoles] = getRoles(message, newBindObject.roles);
	const roleIdArray: string[] = [];
	(roles as DiscordRole[]).forEach((role: DiscordRole) => roleIdArray.push(role.id));

	// Check if the asset exists
	let asset: ProductInfo;
	try {
		asset = await getProductInfo(newBindObject.assetId);
	} catch {
		return message.channel.send(
			embed(
				"Error",
				`Asset with ID of ${newBindObject.assetId} was not found.`,
				guild,
				"failure"
			)
		);
	}

	const AssetbindObject: AssetBindType = {
		assetId: newBindObject.assetId,
		hierarchy: newBindObject.hierarchy,
		nickname: newBindObject.nickname,
		roles: roleIdArray,
	};

	if (roles.length > 0) {
		// The old bindings combined with the new one
		const newObject = verification[newBindObject.type + "_binds"].push(
			AssetbindObject
		);

		const mappedRoles = (roles as any).map((i: Role) => `${i.name}(${i})`).join(', ')

		await verification.update(newBindObject.type + "_binds", newObject);
		await message.guildembed(
			"Bind Successfully Created",
			`A binding has successfully been created for the asset **${
				asset.Name
			}(${asset.AssetId})** by ${asset.Creator.Name}
			Hierarchy: ${AssetbindObject.hierarchy}
			Nickname: ${AssetbindObject.nickname}
			${roles.length > 1 ? "Roles" : "Role"}:
			${mappedRoles}
			`,
			guild,
			"success",
			true,
			true
		)
	}
	if (missingRoles.length > 0) {
		message.channel.send(
			embed(
				"Missing Roles",
				`The following roles were not found:\n\`${missingRoles.join(", ")}\``,
				guild,
				"failure"
			)
		);
	}

	return;
}

export async function NewRoleBind(
	bot: Client,
	message: Message,
	guild: GuildSettings,
	verification: VerificationSettings,
	newBindObject: NewRoleBindInterface,
	groupRanks: Role[]
): Promise<void> {
	if (
		!verification.role_binds.find((group: any) => group.id === newBindObject.groupId)
	)
		verification.role_binds.push({
			id: newBindObject.groupId,
			main: false,
			binds: [],
		});
	const [roles, missingRoles] = getRoles(message, newBindObject.roles);
	const roleIdArray: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	roles.forEach((r: any) => roleIdArray.push(r.id));

	if (newBindObject.flags && newBindObject.flags?.includes("--deleteprev")) {
		const group = verification.role_binds.find(o => {
			o.id == newBindObject.groupId;
		}) 
		if (group) group.binds = []
	}

	for (let i = 0; i < newBindObject.ranks.length; i++) {
		const bind = (newBindObject.ranks[i] as any) as Role;
		const newBind: GroupBinds = {
			id: bind.id,
			nickname: newBindObject.nickname,
			hierarchy: newBindObject.hierarchy,
			roles: roleIdArray,
		};
		// If bind isn't found
		if (
			!verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.find((abind) => abind.id === bind.id)
		)
			verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.push(newBind);
		if (
			newBindObject.flags &&
			newBindObject.flags!.includes("--editexisting")
		) {
			const pastExisting = verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.find((abind) => abind.id === bind.id)!;

			const index = verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.indexOf(pastExisting);

			verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.splice(index, 1);
			const presentExisting = {
				id: bind.id,
				nickname:
					checkExistingFlags("nickname", newBindObject) == true
						? newBindObject.nickname
						: pastExisting.nickname,
				hierarchy:
					checkExistingFlags("hierarchy", newBindObject) == true
						? newBindObject.hierarchy
						: pastExisting.hierarchy,
				roles:
					checkExistingFlags("rolesjoin", newBindObject) == true
						? pastExisting.roles.concat(roleIdArray)
						: checkExistingFlags("rolesreplace", newBindObject) == true
						? roleIdArray
						: pastExisting.roles,
			};
			verification.role_binds
				.find((group: any) => group.id === newBindObject.groupId)!
				.binds.push(presentExisting)
		}
	}
	// Update
	await verification.update('role_binds', verification.role_binds)

	// Finish Message
	await message.channel.send(
		embed(
			"Group Binds Successfully Created",
			`Successfully created the binds for the given ranks.`,
			guild,
			"success",
			true,
			true
		)
	);

	if (missingRoles.length > 0) {
		const mappedMissingRoles = (missingRoles as string[])
			.map((e: any) => `${e}`)
			.join(", ");
		message.channel.send(
			embed(
				"Missing Roles",
				`The following roles were not found: \`${mappedMissingRoles}\``,
				guild,
				"failure",
				false,
				true
			)
		);
	}
}

function getRoles(message: Message, binds: string[]) {
	const foundRoles: DiscordRole[] = [];
	const missingRoles: string[] = [];

	for (let value of binds) {
		if (value.startsWith("<@&") && value.endsWith(">")) {
			value = value.substring(3);
			value = value.substring(0, value.length - 1);
			const role = message.guild!.roles.cache.get(value);
			if (role) foundRoles.push(role);
			else missingRoles.push(value);
		} else if (isNaN(value as any) == false) {
			const role = message.guild!.roles.cache.get(value);
			if (role) foundRoles.push(role);
			else missingRoles.push(value);
		} else if (isNaN(value as any) == true) {
			const role = message.guild!.roles.cache.find(
				(role: any) => role.name === value
			);
			if (role) foundRoles.push(role);
			else missingRoles.push(value);
		}
	}
	return [foundRoles, missingRoles];
}

function checkExistingFlags(flag: string, newBindObject: NewRoleBindInterface) {
	if (!newBindObject) return false;
	if (
		newBindObject.editexistingFlags &&
		newBindObject.editexistingFlags.includes(flag)
	)
		return true;
	else return false;
}

import OriginMessage from "../../../lib/extensions/OriginMessage";
import { Message, Role as DiscordRole } from "discord.js";
import { GroupBinds } from "../../../typings/origin";
import { getRoles, Role as RobloxGroupRole } from "noblox.js";
import { RegularEmbed } from "../../../functions/embed";

export async function createRoles(
	message: OriginMessage,
	msgToEdit: Message,
	groupRoles: RobloxGroupRole[]
): Promise<GroupBinds[] | undefined> {
	if (!message.guild) return;
	// Get Role Binds
	const binds: GroupBinds[] = [];
	// Loop through the guilds Roles and Create Roles for them
	for (let i = 0; i < groupRoles.length; i++) {
		const groupRole = groupRoles[i];
		msgToEdit.edit(
			RegularEmbed({ description: `Merging Role \`${groupRole.name}\`` })
		);
		const findRoleByName = message.guild.roles.cache.find(
			(role) => role.name == groupRole.name
		);
		if (findRoleByName) {
			const roleObject: GroupBinds = {
				id: groupRole.id,
				hierarchy: 1,
				nickname: "default",
				roles: [findRoleByName.id],
			};
			binds.push(roleObject);
		} else {
			const createRole = await message.guild.roles.create({
				data: {
					name: groupRole.name,
				},
				reason: "Nexus Origin Verification Role Creation",
			});
			const roleObject: GroupBinds = {
				id: groupRole.id,
				hierarchy: 1,
				nickname: "default",
				roles: [createRole.id],
			};
			binds.push(roleObject);
		}
	}
	return binds;
}

export async function deleteRoles(message: OriginMessage, msgToEdit: Message, groupRoles: RobloxGroupRole[]): Promise<GroupBinds[]|undefined> {
	if (!message.guild) return;
	function deletableRole(role: DiscordRole) {
		const answer = role.editable && !role.managed;
		return answer;
	}

	message.guild.roles.cache.forEach(role => {
		if (!deletableRole(role)) return;
		msgToEdit.edit(RegularEmbed({ description: `Deleting role \`${role.name}\`` }))
		role.delete();
	})
	return await createRoles(message, msgToEdit, groupRoles)
}
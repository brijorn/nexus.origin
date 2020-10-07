import { Guild, Message, MessageEmbed, Role } from "discord.js";
import { message } from "noblox.js";
import { OriginMessage } from "../../../lib/extensions/OriginMessage";
import { editPrompt } from "../../../lib/util/prompt";

export async function createVerificationRole(guild: Guild): Promise<Role> {
	const searchForRole = guild.roles.cache.find(
		(r) => r.name.toLowerCase() == "verified"
	);
	if (searchForRole) return searchForRole;
	else {
		return await guild.roles.create({
			data: {
				name: "Verified",
			},
			reason: "Verified Role Creation",
		});
	}
}

export async function customVerificationRole(
	message: OriginMessage,
	msgToEdit: Message
): Promise<Role | undefined> {
	const RoleName = await editPrompt(message, msgToEdit, {
		title: "Custom Verification Role",
		description:
			"What is the name of the role?\nNote: If I cannot find the role I will create it.\n\nRespond Cancel to cancel.",
	});
	if (!RoleName) return;
	const searchForRole = message.guild?.roles.cache.find(
		(r) => r.name == RoleName
	);
	if (searchForRole) return searchForRole;
	else {
		return await message.guild?.roles.create({
			data: {
				name: RoleName,
			},
			reason: "Custom Verified Role Creation",
		});
	}
}

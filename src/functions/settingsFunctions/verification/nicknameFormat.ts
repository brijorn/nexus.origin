import { editStart } from "../../../lib/util/prompt";
import formats from "../../../lib/util/json/formats.json";
import config from "../../../lib/util/json/config.json";
import { MessageEmbed } from "discord.js";

import { VerificationSettings, GuildSettings } from "../../../typings/origin";
import OriginClient from "../../../lib/OriginClient";
import { OriginMessage } from "../../../lib/extensions/OriginMessage";

module.exports = async (
	bot: OriginClient,
	verification: VerificationSettings,
	message: OriginMessage,
	args: string[],
	guild: GuildSettings
) => {
	if (!args[2]) {
		const note =
			"\nYou can also accompany these with regular text. Such as, `Hi, {{discordname}}#{discordtag}}` or `[{{rank}}]{{robloxname}}`";
		const list = formats.nicknameformats
			.map((each) => `${each.name} -> ${each.description}`)
			.join("\n\n");
		const startmsg = new MessageEmbed()
			.setTitle("Nickname Formats")
			.setDescription(
				`What would you like to set the format to?\n**Available Formats:**\n\`\`\`${list}\`\`\`` +
					note +
					"\n\nRespond **cancel** to cancel."
			)
			.setFooter(guild.embed.footer, guild.embed.footerlogo);
		const start = await editStart(message, {
			title: "Nickname Formats",
			description:
				`What would you like to set the format to?\n**Available Formats:**\n\`\`\`${list}\`\`\`` +
				note +
				"\n\nRespond **cancel** to cancel.",
		});
		if (start?.content.toLowerCase() === "cancel") {
			start?.message.delete({ timeout: 5000 });
			return message.channel.send("Cancelled.");
		}
		start?.message.edit({
			title: "Nickname Format",
			description: `${config.enabled}Your nickname format has successfully changed to \`${start?.content}\``,
			color: "success",
		});
		await verification.update("nicknameFormat", start?.content as string);
	}
};

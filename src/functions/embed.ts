import { ColorResolvable, MessageEmbed } from "discord.js";
import { EmbedFields, GuildSettings } from "../typings/origin";

enum Colors {
	GREEN_SUCCESS = "#3bff86",
	RED_FAILURE = "#ff6257",
}

export default function (
	title: string,
	description: string,
	guild: GuildSettings,
	color?: ColorResolvable,
	footer?: boolean | string,
	timestamp?: boolean
): MessageEmbed {
	const construct = new MessageEmbed();

	if (title !== "none") construct.setTitle(title);
	construct.setDescription(description);

	if (timestamp === true) construct.setTimestamp();
	construct.setFooter(
		guild.embed.footer !== "none"
			? typeof footer === "string"
				? footer
				: guild.embed.footer
			: "",
		guild.embed.footerlogo !== "none" ? guild.embed.footerlogo : ""
	);
	construct.setColor(
		!color || color === "default"
			? guild.embed.color !== "none"
				? guild.embed.color
				: ""
			: color === "success"
			? Colors.GREEN_SUCCESS
			: color === "failure"
			? Colors.RED_FAILURE
			: ""
	);
	return construct;
}
export function RegularEmbed(
	opt: EmbedFields
): MessageEmbed {
	const construct = new MessageEmbed()
	if (opt.title) {
		if (opt.title !== 'none') construct.setTitle(opt.title)
	}
	if (opt.description) construct.setDescription(opt.description)
	if (opt.footer) construct.setFooter(opt.footer.text, opt.footer.iconURL || '')
	if (opt.author) construct.setAuthor(opt.author.name, opt.author.icon)
	if (opt.thumbnail) construct.setThumbnail(opt.thumbnail)
	if (opt.timestamp && opt.timestamp == true) construct.setTimestamp()
	if (opt.color) {
		if (opt.color === 'success') construct.setColor(Colors.GREEN_SUCCESS)
		else if (opt.color === 'failure') construct.setColor(Colors.RED_FAILURE)
		else construct.setColor(opt.color)
	}
	return construct;
}
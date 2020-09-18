import { ColorResolvable, MessageEmbed } from "discord.js";
import GuildSettings from "../db/guild/types";

export default function (title: any, description: any, guild: GuildSettings, color?: any, footer?: boolean | string, timestamp?: boolean) {
		const construct = new MessageEmbed();

		if (title !== 'none') construct.setTitle(title)
		construct.setDescription(description);

		if (timestamp === true) construct.setTimestamp()
		construct.setFooter(
			(guild!.embed.footer !== 'none') ? (typeof footer === 'string') ? footer : guild!.embed.footer : '',
			(guild!.embed.footerlogo !== 'none') ? guild!.embed.footerlogo : ''
			)
		construct.setColor(
			(!color || color === 'default') ? (guild.embed.color !== 'none') ? guild.embed.color : '' : ''
		)
		return construct
	};

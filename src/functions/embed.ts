import { ColorResolvable, MessageEmbed } from "discord.js";
import { GuildSettings } from "@lib/origin";

enum Colors {
	GREEN_SUCCESS='#3bff86',
	RED_FAILURE='#ff6257'
}

export default function (title: any, description: any, guild: GuildSettings, color?: ColorResolvable, footer?: boolean | string, timestamp?: boolean) {
		const construct = new MessageEmbed();

		if (title !== 'none') construct.setTitle(title)
		construct.setDescription(description);

		if (timestamp === true) construct.setTimestamp()
		construct.setFooter(
			(guild!.embed.footer !== 'none') ? (typeof footer === 'string') ? footer : guild!.embed.footer : '',
			(guild!.embed.footerlogo !== 'none') ? guild!.embed.footerlogo : ''
			)
		construct.setColor(
			(!color || color === 'default') ? 
			(guild.embed.color !== 'none') ? guild.embed.color : '' 
			: 
			(color === 'success') ? Colors.GREEN_SUCCESS : (color === 'failure') ? Colors.RED_FAILURE : ''
		)
		return construct
	};

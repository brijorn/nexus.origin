import { Panel, GuildSettings } from "../../typings/origin";
import { Client, Message } from "discord.js";

import embed from "../../functions/embed";

import ticketing from '../../plugins/ticketing/creation/main'
import OriginClient from "../../lib/OriginClient";
export default async (
	bot: OriginClient,
	message: Message,
	args: string[],
	guild: GuildSettings
) => {
	const name = args.slice(0).join(" ");
	if (!name)
		return message.channel.send(
			embed(
				"none",
				"Run the command again with the name of the panel you wish to create a ticket for.",
				guild,
				"",
				true,
				true
			)
		);

	const panel = new Panel(await bot.handlers.database.getOne('ticketing', 'interfaces', {
		'guild_id': message.guild!.id,
		'interface_name': name
	}))
    
	if (!panel || panel.interface_enabled === false)
		return message.channel.send(
			embed(
				"none",
				`The ticket panel ${name} does not exist or is unavailable.`,
				guild,
				"default",
				true,
				true
			)
		);

	return await ticketing(bot, message, guild, "command", panel);
};

module.exports.help = {
	name: "new",
	description: "Creates a new ticket for the given panel",
	module: "ticketing",
	syntax: ["!new support"],
};

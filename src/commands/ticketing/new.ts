import { Panel, GuildSettings } from "../../typings/origin";
import { Message } from "discord.js";

import OriginClient from "../../lib/OriginClient";
import OriginMessage from "../../lib/extensions/OriginMessage";
import CreateTicketCommand from "../../plugins/ticketing/CreateTicketCommand";
export default async (
	bot: OriginClient,
	message: OriginMessage,
	args: string[],
	guild: GuildSettings
): Promise<void|Message> => {
	const name = args.slice(0).join(" ");
	if (!name)
		return message.error("Run the command again with the name of the panel you wish to create a ticket for.");

	const panel: Panel = await bot.handlers.database.getOne('ticketing', 'interfaces', {
		'guild_id': message.guild?.id,
		'interface_name': name
	});
    
	if (!panel || panel.interface_enabled === false)
		return message.error(`The panel ${name} does not exist or is unavailable.`,);

	return await CreateTicketCommand(bot, message, panel)
};

module.exports.help = {
	name: "new",
	description: "Creates a new ticket for the given panel",
	module: "ticketing",
	syntax: ["!new support"],
};

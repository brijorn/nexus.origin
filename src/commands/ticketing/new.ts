import { Panel, GuildSettings } from "../../typings/origin";
import { Message } from "discord.js";

import OriginClient from "../../lib/OriginClient";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import CreateTicketCommand from "../../plugins/ticketing/CreateTicketCommand";
import Command from "../../lib/structures/Command";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'new',
			description: 'Create a new ticket of the specified type.',
			syntax: ['new <panel-name>'],
		})
	}

	async run(message: OriginMessage, args: string[]): Promise<void|Message> {
		const name = args.slice(0).join(" ");
	if (!name)
		return message.error("Run the command again with the name of the panel you wish to create a ticket for.");

	const panel: Panel = await this.bot.handlers.database.getOne('ticketing', 'interfaces', {
		'guild_id': message.guild?.id,
		'interface_name': name
	});
    
	if (!panel || panel.interface_enabled === false)
		return message.error(`The panel ${name} does not exist or is unavailable.`,);

	return await CreateTicketCommand(this.bot, message, panel)
	}
}
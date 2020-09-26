/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Guild, Message, TextChannel, User } from "discord.js";
import { Panel } from "../../typings/origin.d";
import { OriginMessage } from "../../typings/origin";
import CreateOverwrites from "./functions/CreateOverwrites";
import { TicketClaimData, TicketCommandCreateData } from "./TicketManager";
import formatEmbed from "./functions/formatEmbed";


export default async (
    guild: Guild,
    user: User,
    panel: Panel,
	type: "command" | "reaction",
    data: TicketCommandCreateData | TicketClaimData,
    message?: OriginMessage
): Promise<Response | Message> => {
	const response: Response = { channel_id: '0', menu_id: '0' };
	const sendMethod =
		type === "command"
			? panel.command_dm_prompt == true
				? user.send
				: message!.embed
			: user.send;

	let category = guild.channels.cache.find(
		(channel) =>
			channel.name === panel.open_category && channel.type === "category"
	);
	if (!category) {
        try {
			category = await guild.channels.create(panel.open_category, {
				type: "category"
			});
		} catch {
			return sendMethod({
				title: "Error",
				description:
					"Failed to create support channel. Please make sure my permissions are sufficient.",
				color: "failure",
			});
        }
    }
    let channel: TextChannel;

        let menu: Message;
        try {
            const channelName = panel.ticket_name
            channel = await guild.channels.create(channelName, {
                parent: category,
                type: 'text',
                permissionOverwrites: CreateOverwrites(guild, panel, user, 'creation', data)
            })
            response.channel_id = channel.id

            const menuJson = JSON.parse(JSON.stringify(panel.open_message))
            const menuData = await formatEmbed(guild, user, menuJson, panel, data)

            menu = await channel.send(menuData)
            response.menu_id = menu.id

        }
        catch {
            sendMethod({
                title: 'Error Sending Menu',
                description: 'I could not send the menu message to the support channel. Be sure the message JSON data is valid.',
                color: 'failure'
            })
        }
        

	return response;
};

interface Response {
    channel_id: string
    menu_id: string
}

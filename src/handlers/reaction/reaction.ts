import db from "../../db";
import { Panel } from "../../db/ticketing/types";
import { MessageReaction, Client, User } from "discord.js";
import { message } from "noblox.js";

module.exports = async (bot: Client, reaction: MessageReaction, user: User) => {
	if (user.bot === true) return;
	// If it is a Create Ticketing Message
	const ticketing = require("../../lib/ticketing/main");
	let ticketpanel: Panel = await db
		.raw(
			`
    (SELECT *
    FROM "ticketing"."ticket_interfaces"

    INNER JOIN "guild" USING(guild_id)

    WHERE 
        guild_id = '${reaction.message.guild!.id}'
        AND message_id = '${reaction.message.id}'
        AND message_reaction = '${reaction.emoji.name}'
        OR message_reaction = '${reaction.emoji.id}'
    LIMIT 1)
	`
		)
		.then((t: any) => t.rows[0]);
	const guild = await db
		.table("guild")
		.where("guild_id", "=", reaction.message.guild!.id)
		.first();
	if (!ticketpanel || ticketpanel.interface_enabled === true) {
		await ticketing(bot, guild);
	}
	// If its claim
	const claim = await db
		.withSchema("ticketing")
		.table("ticket_awaitingclaim")
		.where("guild_id", "=", reaction.message.guild!.id)
		.where("message_id", "=", reaction.message.id)
		.first();
	if (claim) {
		const claimpanel = await db
			.withSchema("ticketing")
			.table("ticket_interfaces")
			.where("guild_id", "=", reaction.message.guild!.id)
			.where("panel_id");
	}
};

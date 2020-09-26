import { Guild, MessageReaction, User } from "discord.js";
import OriginClient from "../../../lib/OriginClient";
import ClaimTicket from "../ClaimTicket";
import CreateTicketReaction from "../CreateTicketReaction";

export default async (bot: OriginClient, reaction: MessageReaction, user: User): Promise<void> => {

    if (reaction.partial == true) await reaction.fetch()
    const reactionEmoji = reaction.emoji.name || reaction.emoji.id as string
    const guild = reaction.message.guild as Guild
    if (!guild) return;

    // If its a creation message
    const panel = await bot.handlers.ticket.panels.fetch({
        guild_id: guild.id,
        message_id: reaction.message.id,
        
    })
    if (panel) {
        return await CreateTicketReaction(bot, guild, user)
    }


    const claim = await bot.handlers.ticket.tickets.unclaimed.fetch({
        guild_id: guild.id,
        channel_id: reaction.message.channel.id,
        reaction: reactionEmoji
    })
    if (claim) {
        return await ClaimTicket(bot, guild, user)
    }

}
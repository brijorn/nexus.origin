import { Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { GuildMemberFormats } from "../../lib/constants/baseFormats";
import FormatEmbed from "../../lib/util/FormatEmbed";
import { WelcomeSettings } from "../../typings/origin";

export default async (member: GuildMember, welcome: WelcomeSettings): Promise<void> => {
    const channel = member.guild.channels.cache.get(welcome.channel) as TextChannel
    if (!channel) return;


    if (welcome.embed == true) {
        const format = await FormatEmbed(member, member, GuildMemberFormats)
        if (!format) return
        channel.send(
            format.content,
            format.embed
        )
    }
    else {
        channel.send(welcome.message)
    }

    return;
}
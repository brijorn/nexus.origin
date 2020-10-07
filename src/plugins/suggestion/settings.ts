import { Message } from "discord.js";
import { RegularEmbed } from "../../functions/embed";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import { SuggestionSettings } from "../../typings/origin.d";
import { GuildSettings } from "../../typings/origin";

export default async (bot: OriginClient, message: OriginMessage, guild: GuildSettings, args: string[]): Promise<void|Message> => {
    const settings: SuggestionSettings = await bot.handlers.database.getOne('modules', 'suggestion', { guild_id: message.guild?.id })
    if (!settings) {
        if (args[1].toLowerCase() == 'create') {
            await bot.handlers.database.insert('modules', 'suggestion', {
                guild_id: message.guild?.id,
                enabled: false,
                channel: '',
                suggestion_count: 0,
                first_reaction: '739276114542985278',
                second_reaction: '<:crossmark:739276149800304643>',
            })
            return message.success('Successfully created the default suggestion settings.', 'Settings Created')
        }
        else return message.guildembed(
            'No Settings',
            `There are no suggestion settings for this guild.
            You can create the default settings with ${guild.prefix}settings suggestions create`,
            guild, 'default', true, false
        )
    }
    const argument = args[1].toLowerCase()
    // Settings Menu
    if (!argument) {
        return message.send(RegularEmbed({
            title: 'Suggestion Settings',
            description: `Fields are configured with the command ${guild.prefix}settings suggestions <field> [value]`,
            fields: [
                { name: 'Enabled', value: (settings.enabled == true) ? 'true' : 'false', inline: true},
                { name: 'Channel', value: settings.channel, inline: true},
                { name: 'Cooldown', value: settings.suggestion_cooldown, inline: true},
                { name: 'BlacklistedRoles', value: mapped(settings.blacklisted_roles), inline: true},
                { name: 'WhitelistedRoles', value: mapped(settings.whitelisted_roles), inline: true},
                { name: 'AdminRoles', value: mapped(settings.admin_roles), inline: true},
                { name: 'FirstReaction', value: settings.first_reaction, inline: true},
                { name: 'SecondReaction', value: settings.second_reaction, inline: true},
                { name: 'SuggestionCount', value: settings.suggestion_count, inline: true},
            ]
        }))
    }

    // Configuration
    

}

function mapped(arr: Array<string>) {
    return arr.map(value => `${value}`).join(', ')
}
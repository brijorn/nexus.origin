import { Message } from "discord.js";
import Command from "../../lib/structures/Command";
import { parseMember } from "../../lib/util/parse";
import { modChecks, modLog, MODERATION_TYPES } from "../../plugins/moderation/laws";
import { OriginClient, OriginMessage } from "../../typings/origin";

export default class extends Command {
    constructor(bot: OriginClient) {
        super(bot, {
            name: 'unmute',
            description: 'Unmute a member'
        })

    }

    async run (message: OriginMessage, args: string[]): Promise<void|Message> {
        if (!message.guild) return;

        const moderation = await modChecks(this.bot, message, 'MANAGE_ROLES')
        if (!moderation) return;

        const user = parseMember(message.guild, args[0])
        if (!user) return message.failure('Please give a user to unmute')

        const reason = args.slice(1).join(' ') || 'None'

        if (user.roles.cache.has(moderation.muted_role)) {
            user.roles.remove(moderation.muted_role)

            const key = `mute:${user.guild.id}:${user.id}`
            const getCacheJobId = await this.bot.handlers.cache.get(key)

            if (getCacheJobId) {
                await this.bot.handlers.job.cancel(getCacheJobId)
                const del = this.bot.handlers.cache.delete(key)
            }
            
            message.success(`Successfully unmuted ${user}`)
            const typeObj = MODERATION_TYPES.find(type => type.name == 'unmute')
            await modLog(moderation, message.guild, {
                author: {
                    name: message.author.tag,
                    icon: message.author.avatarURL() || ''
                },
                description: `**${typeObj?.emoji} ${typeObj?.pastProper} ${user.user.tag}**(**ID**: ${user.id})
		📄 **Reason:** ${reason}`,
		color: typeObj?.color,
		thumbnail: user.user.avatarURL({ size: 256, dynamic: true }) || '',
            })
        }
        else return message.failure(`The user ${user} is not muted`)
    }
}
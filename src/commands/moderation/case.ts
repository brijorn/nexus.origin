import { Message, MessageEmbed } from "discord.js";
import Command from "../../lib/structures/Command";
import formatDate from "../../lib/util/formatdate";
import { modChecks } from "../../plugins/moderation/laws";
import { GuildSettings, ModerationCase, OriginClient, OriginMessage } from "../../typings/origin";

export default class extends Command {
    constructor(bot: OriginClient) {
        super(bot, {
            name: 'case'
        })
    }

    async run (message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
        const moderation = modChecks(this.bot, message)
        if (!moderation) return;

        const caseId = args[0]
        if (!caseId) return message.error('Please give the id of the case to get')

        const foundCase: ModerationCase = await this.bot.handlers.database.getOne('logs', 'moderation', { guild_id: message.guild?.id, case_id: caseId })
        if (!foundCase) return message.failure(`Could not find a case with an id of ${caseId}`)
        const proper = foundCase.type.charAt(0).toUpperCase() + foundCase.type.slice(1)
        const caseEmbed = new MessageEmbed()
        .setTitle(`${proper} Case ${foundCase.case_id}`)
        .setColor('#3289a8')
        .addField('User', `${foundCase.user_tag}\n*ID: ${foundCase.user_id}*`, true)
        .addField('Moderator', `${foundCase.mod_tag}\n*ID: ${foundCase.mod_id}*`, true)
        .addField('Reason', foundCase.reason, true)
        .setFooter(`Date: ${formatDate(foundCase.date)}`)
        
        message.channel.send(caseEmbed)

    }
}
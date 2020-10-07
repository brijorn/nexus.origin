import { GuildMember } from "discord.js";
import Event from "../lib/structures/Event";
import JoinVerification from '../plugins/verification/JoinVerification'
import SendWelcomeMessage from "../plugins/welcome/SendWelcomeMessage";
export default class extends Event {

    async execute(member: GuildMember): Promise<void> {
        if (member.partial) return;
        const welcome = await this.bot.handlers.database.getOne('modules', 'welcome', {
            'guild_id': member.guild.id
        })
        if (welcome && welcome.enabled === true) {
            await SendWelcomeMessage(member, welcome);
        }
    
        const verification = await this.bot.handlers.verification.settings.fetch(member.guild.id)
        if (!verification) return;

        if (verification.autoVerify === true) {
            console.log(true);
            return JoinVerification(this.bot, member, verification);
        }
        else if (verification.unverifiedEnabled === true) {
            member.roles
                .add(verification.unverified_role)
                .catch(() => {
                    if (member.guild.owner) member.guild.owner.send(
                        "There seems to be a problem with the **Unverified** role."
                    )
                    });
        }
    }
}
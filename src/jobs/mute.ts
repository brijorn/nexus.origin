import { MessageEmbed, TextChannel } from "discord.js";
import OriginClient from "../lib/OriginClient";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Job from "../lib/structures/Job";

export default class extends Job {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async execute(bot: OriginClient, job: any): Promise<any> {
       console.count('step')
       const res: MuteOptions = job.data

       const guild = bot.guilds.cache.get(res.guild_id)
       if (!guild) return res.fail()
       console.count('step')

       const user = guild.members.cache.get(res.user_id)
       if (!user) return job.fail()

       try {
           user.roles.remove(res.muted_role)
       }
       catch {
           return job.fail()
       }
       const log = guild?.channels.cache.get(res.log_channel) as TextChannel
       if (!log || log.type !== 'text') return job.done()

       console.count('step')
       const unmute = new MessageEmbed()
       .setAuthor(bot.user?.tag, bot.user?.avatarURL() || '')
       .setDescription(
           `**🔊Unmuted** ${user.user.tag}(**ID:** ${res.user_id})
           **📄Reason:** Mute Duration Expired`
       )
       .setThumbnail(user.user.avatarURL() || '')
       .setColor('#5079a6')
       await log.send(unmute)
       .catch()
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async complete (bot: OriginClient, data: any) {
       console.log('Job Complete')
    }
} 
interface MuteOptions {
    guild_id: string,
    user_id: string,
    log_channel: string,
    muted_role: string,
    fail: any,
    done: any,
}
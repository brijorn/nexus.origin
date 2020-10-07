/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Client, Message } from "discord.js";
import { GuildSettings } from "../../typings/origin";

import embed from "../../functions/embed";
import moment from 'moment-timezone';
import Command from "../../lib/structures/Command";
import OriginClient from "../../lib/OriginClient";
import { OriginMessage } from "../../lib/extensions/OriginMessage";

export default class extends Command {
    constructor(bot: OriginClient) {
        super(bot, {
            name: 'uptime',
            description: 'View bot\'s uptime'
        })
    }

    async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message> {
        function convertMiliseconds(miliseconds: any, format?: any) {
            let days: any, hours: any, minutes: any, seconds: any, 
            total_hours: any, total_minutes: any, total_seconds: any;
            
            total_seconds = parseInt(Math.floor(miliseconds / 1000) as any);
            total_minutes = parseInt(Math.floor(total_seconds / 60) as any);
            total_hours = parseInt(Math.floor(total_minutes / 60) as any);
            days = parseInt(Math.floor(total_hours / 24) as any);
          
            seconds = parseInt(total_seconds % 60 as any);
            minutes = parseInt(total_minutes % 60 as any);
            hours = parseInt(total_hours % 24 as any);
            
            switch(format) {
              case 's':
                  return total_seconds;
              case 'm':
                  return total_minutes;
              case 'h':
                  return total_hours;
              case 'd':
                  return days;
              default:
                  return { d: days, h: hours, m: minutes, s: seconds };
            }
          }
        
        let uptime = convertMiliseconds(parseInt(this.bot.uptime as unknown as any))
        uptime = `${uptime.d} Days ${uptime.h} hours ${uptime.m} minutes and ${uptime.s} seconds`
        const embede = embed('Uptime', `Bot Uptime: ${uptime}`, guild, '#', true, true)
        const start = moment(this.bot.readyAt).tz('America/New_York').format("ddd, MMM Do YYYY hh:mm a")
        embede.setFooter(`Origin | Last Started: ${start}`)
        return message.channel.send(embede)
    }
}
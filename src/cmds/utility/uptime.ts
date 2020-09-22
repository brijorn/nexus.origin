import { Client, Message } from "discord.js";
import { GuildSettings } from "@lib/origin";

import embed from "../../functions/embed";
import moment from 'moment-timezone';

export async function run(bot: Client, message: Message, args: any[], guild: GuildSettings) {
    function convertMiliseconds(miliseconds: any, format?: any) {
		var days: any, hours: any, minutes: any, seconds: any, 
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
      };
    
    let uptime: any = convertMiliseconds(parseInt(bot.uptime as any))
    uptime = `${uptime.d} Days ${uptime.h} hours ${uptime.m} minutes and ${uptime.s} seconds`
    const embede = embed('Uptime', `Bot Uptime: ${uptime}`, guild, '#', true, true)
    const start = moment(bot.readyAt).tz('America/New_York').format("ddd, MMM Do YYYY hh:mm a")
    embede.setFooter(`Origin | Last Started: ${start}`)
    message.channel.send(embede)
    
    
}

module.exports.help = {
	name: 'uptime'
}
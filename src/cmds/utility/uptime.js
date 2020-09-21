"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const embed_1 = __importDefault(require("../../functions/embed"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
async function run(bot, message, args, guild) {
    function convertMiliseconds(miliseconds, format) {
        var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
        total_seconds = parseInt(Math.floor(miliseconds / 1000));
        total_minutes = parseInt(Math.floor(total_seconds / 60));
        total_hours = parseInt(Math.floor(total_minutes / 60));
        days = parseInt(Math.floor(total_hours / 24));
        seconds = parseInt(total_seconds % 60);
        minutes = parseInt(total_minutes % 60);
        hours = parseInt(total_hours % 24);
        switch (format) {
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
    ;
    let uptime = convertMiliseconds(parseInt(bot.uptime));
    uptime = `${uptime.d} Days ${uptime.h} hours ${uptime.m} minutes and ${uptime.s} seconds`;
    const embede = embed_1.default('Uptime', `Bot Uptime: ${uptime}`, guild, '#', true, true);
    const start = moment_timezone_1.default(bot.readyAt).tz('America/New_York').format("ddd, MMM Do YYYY hh:mm a");
    embede.setFooter(`Origin | Last Started: ${start}`);
    message.channel.send(embede);
}
exports.run = run;
module.exports.help = {
    name: 'uptime'
};

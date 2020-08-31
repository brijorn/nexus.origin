const embed = require("../../functions/embed")
const moment = require('moment-timezone')
module.exports.run = async (bot, message, args, guild) => {

    let totalSeconds = (bot.uptime / 1000);
    let weeks = (totalSeconds > 604800000) ? Math.floor(totalSeconds / 604800000) : 0
    totalSeconds %= 604800000
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let string = `${weeks} Weeks ${days} Days ${minutes} minutes and ${seconds} seconds`

    const embede = embed('Uptime', `Bot Uptime: ${string}`, guild, '#', true, true)
    const start = moment(bot.readyAt).tz('America/New_York').format("ddd, MMM Do YYYY hh:mm a")
    embede.setFooter(`Origin | Last Started: ${start}`)
    message.channel.send(embede)
    
    
}

module.exports.help = {
    name: 'uptime'
}
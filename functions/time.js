
const moment = require('moment-timezone')
const timezones = require('../timezones.json')
module.exports = async (bot, message, args, guild) => {
    let name = ''
    let time = ''
    arg = args[0]
        try {
            time = new Date().toLocaleString("en-US", {timeZone: arg});
            name = arg
        }
        catch {
            const obj = timezones.find(o => o.abbr.toLowerCase() === arg.toLowerCase())
            time = moment.tz().utcOffset(obj.offset).format('DD/MM/YYYY hh:mm A')
            name = arg
            if (obj === undefined) return message.channel.send('Invalid timezone given.'); name = undefined
        }
    name = arg
    return {
        time, 
        name
    }
}
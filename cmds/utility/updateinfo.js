const guildModel = require('../../models/guildModel/guild')

module.exports.run = async (bot, message, args, guild) => {
    message.channel.send('You tried?')
}

module.exports.help = {
    name: 'updateinfo',
    module: 'utility',
    description: 'If suggestions are enabled, sends one to the channel.',

}
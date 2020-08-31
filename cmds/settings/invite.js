const embed = require('../../functions/embed')

module.exports.run = async (bot, message, args, guild) => {
    const info = embed('Invites', 'Invites for Nexus Origin', guild)
    .addField('Bot', '[Link](https://discord.com/api/oauth2/authorize?client_id=737721159667286086&permissions=8&scope=bot)')
    .addField('Support Server', '[Link](https://discord.gg/vkAnR2b)')
    message.channel.send(info)
}

module.exports.help = {
    name: 'invite',
    module: 'settings',
    description: 'Links bot invite and support server'
}
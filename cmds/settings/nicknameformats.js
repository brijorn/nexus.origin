const embed = require('../../functions/embed')
const formats = require('../../formats.json')

module.exports.run = async (bot, message, args, guild) => {
    const sort = formats.nicknameformats.map(each => `${each.name} -> ${each.description}`).join('\n\n')
    const note = '\nYou can also accompany these with regular text. Such as, `Hi, {discordname}#{discord-discrim}` or `[{rank}]{robloxname}`\n\n To configure your nickname format run `' + guild.prefix + 'settings verification nicknameformat`'
    const send = embed('Nickname Formats', `Available formats for verification nicknames.\n\`\`\`${sort}\`\`\`` + note, guild)
    message.channel.send(send) 
}

module.exports.help = {
    name: 'nicknameformats',
    module: 'settings',
    description: 'Shows all the bot\'s nickname formats'
}
const embed = require("../../embed")
const formats = require('./welcomeformats.json')
const { success } = require('../../../config.json')
module.exports = async(bot, message, guild, args, msgToEdit) => {
    if (guild.welcome.message === 'none') return msgToEdit.edit(embed('none', 'You have no welcome messages set up.', guild, '#'))
    let welcomemsg = guild.welcome.message
    let welcometitle = guild.welcome.embedTitle
    const member = message.member

    formats.formats.forEach(each => {
        if (welcomemsg.includes(each.name)) {
            welcomemsg = welcomemsg.replace(each.name, eval(each.changeto))
        }
    })
    if (guild.welcome.embedTitle !== 'none') {
        formats.formats.forEach(each => {
            if (welcometitle.includes(each.name)) {
                welcometitle = welcometitle.replace(each.name, eval(each.changeto))
            }
        })
    }
    const sendto = (guild.welcome.channel === 'dm') ? message.author : message.guild.channels.cache.get(guild.welcome.channel)
    
    if (guild.welcome.embed === true) {
        const msg = embed(welcometitle, welcomemsg, guild)
        msg.setFooter('Test welcome message by ' + message.author.username + '#' + message.author.discriminator)
        sendto.send(msg)
    }
    if (guild.welcome.embed === false) {
        sendto.send(welcomemsg)
    }
    msgToEdit.edit(embed('none', 'Welcome message sent successfully.', guild, success))
}
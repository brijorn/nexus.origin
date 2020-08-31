const formats = require('./welcomeformats.json')
const { MessageEmbed } = require('discord.js')

module.exports = async (member, guild) => {
    let welcomemsg = guild.welcome.message
    let welcometitle = guild.welcome.embedTitle

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
    const sendto = (guild.welcome.channel === 'dm') ? member : member.guild.channels.cache.get(guild.welcome.channel)
    if (guild.welcome.embed === true) {
        const msg = new MessageEmbed()
        .setDescription(welcomemsg)
        if (guild.welcome.embedTitle !== 'none') {
            msg.setTitle(welcometitle)
        }
        sendto.send(msg)
    }
    if (guild.welcome.embed === false) {
        sendto.send(welcomemsg)
    }
}
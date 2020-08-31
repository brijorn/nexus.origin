const embed = require('../../functions/embed')
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')
const prompter = require('../../functions/settingsFunctions/session/sessionUsage/prompter')
module.exports.run = async (bot, message, args, guild) => {
    const sessions = guild.sessions.sessions
    if (!guild.sessions || guild.sessions.enabled === false || guild.sessions.sessions.length <= 0) return message.channel.send(embed('There are no sessions for this guild.', guil, config.failure))
    if (!args[0]) return message.channel.send(embed('none', 'Please give a session name to start.', guild))
    if (!sessions.find(sess => sess.name === args[0])) return message.channel.send(embed('none', `The session \`${args[0]}\` does not exist.`, guild, config.failure))
    const info = sessions.find(sess => sess.name === args[0])
    const msg = info.message
    const prompts = await prompter(bot, message, args, guild, info)
    console.log(prompts)
    if (prompts.cancel === true) return
    const finishedthing = new MessageEmbed()
    .setTitle(msg.title)
    .setDescription(msg.description)
    .setFooter(msg.footer)
    .setImage(msg.image)
    message.channel.send(finishedthing)
}

module.exports.help = {
    name: 'session',
    module: 'user',
    description: 'INCOMPLETE RUNNING WILL NOT WORK.'
}
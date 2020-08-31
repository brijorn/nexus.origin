const { MessageEmbed } = require("discord.js")
const embed = require("../../embed")
const editStartPrompt = require("../../../prompt/editStartPrompt")
const questionsAsk = require('./appcreate')
const appFinish = require('./appfinish')
module.exports = async (bot, message, args, guild) => {
    console.log(args)
    if (!args[1]) {
        if (!guild.applications || guild.applications.apps.length < 0) {
            const noappsembed = new MessageEmbed()
            .setTitle('Points Menu')
            .setDescription(`Your guild currently has no applications setup, you can create a new one with ${guild.prefix}settings application create.`)
            .setFooter(guild.embedInfo.footer)
            return message.channel.send(noappsembed)
        }
        if (guild.applications) {
            const apppage = require('./appPage')
            return await apppage(bot, message, guild, args)
        }
    }
    if (args[1] === 'create') {
        const startmsg = embed('Application Creation', 'What is the name of the application?\n\nRespond **cancel** to cancel.', guild)
        const start = await editStartPrompt(message, startmsg)
        if (start.content.toLowerCase() === 'cancel') {
            return start.message.delete({ timeout: 0 })
        }
        const name = start.content
        const questions = await questionsAsk(bot, message, args, guild, start.message)
        const finisher = await appFinish(bot, message, guild, args, questions, name, start.message)
    
    }
    if (args[1] === 'config') {
        let sys = undefined
        if (args[2]) sys = args.slice(2).join(' ')
        else {
            const ask = await editStartPrompt(message, embed('Application Config', `What application would you like to edit?\n**Options:**\`${guild.applications.apps.map(a => `${a.name}`)}\``, guild))
            sys = ask.content
        }
        if (!guild.applications.apps.find(o => o.name === sys)) return message.channnel.send(embed('App Not Found', 'Could not find the given application.', guild))
        const system = guild.applications.apps.find(o => o.name === sys)
    }

}
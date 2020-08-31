const { MessageEmbed } = require("discord.js")
const { enabled, disabled } = require('../../../config.json')
const pagination = require('../../useful/pagination')
module.exports = async (bot, message, guild, args) => {
            const app = guild.applications
            const appstatus = (app && app.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
            const prefix = guild.prefix
            const firstpage = new MessageEmbed()
            .setTitle('Applications Menu')
            .setDescription('Use the pagination arrow to view each of your applications one at a time.')
            .addField('Status', appstatus, true)
            .addField('Applications', `\`${app.apps.map(a => `${a.name}`)}\``, true)
            const givenarray = app.apps
            function getSystem(firstpage, givenarray) {
                const values = ['filler', firstpage]
                if (guild.applications.apps.length === 1) {
                    i = 0
                    const sys = givenarray[0]
                    const page2 = new MessageEmbed()
                    .setTitle(`${sys.name}`)
                    .setDescription('Applications are not currently editable.')
                    .addField('Questions', sys.questions.length, true)
                    .addField('Channel', `<#${sys.channel}>`)
                    .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)
                    values[2] = page2
                }
                else {
                    for (i=0; i < givenarray.length; ++i) {
                       const found = givenarray[i]
                        values[i + 2] = new MessageEmbed()
                        .setTitle(`${found.name}`)
                        .setDescription('Applications are not currently editable.')
                        .addField('Questions', found.questions.length, true)
                        .addField('Channel', `<#${found.channel}>`)
                        .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)
        
                    }
                }

                return values
            }
            return await pagination(bot, message, args, guild, firstpage, getSystem, givenarray)
}
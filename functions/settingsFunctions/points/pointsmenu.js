const information = require('../settingspages')
const { enabled, disabled } = require('../../../config.json')
const { MessageEmbed } = require('discord.js')
const pagination = require('../../useful/pagination')
module.exports = async (bot, message, args, guild) => {
    if (!args[1]) {
        console.log('here')
        if (!guild.points || guild.points.amount === 0) {
            const nopointsembed = new MessageEmbed()
            .setTitle('Points Menu')
            .setDescription(`Your guild currently has no points setup, you can create a new one with ${guild.prefix}settings points create.`)
            .setFooter(guild.embedInfo.footer)
            return message.channel.send(nopointsembed)
        }
        if (guild.points) {
            const pointspage = require('../../useful/pagination')
            const points = guild.points
            const pntstatus = (points && points.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
            const prefix = guild.prefix
            function getSystem(firstpage, givenarray) {
                const values = ['filler', firstpage]
                if (guild.points.amount === 1) {
                    const sys = guild.points.systems[0]
                    const page2 = new MessageEmbed()
                    .setTitle(`${sys.name} System`)
                    .setDescription('Systems are not currently editable.')
                    .addField('Users', sys.users.length, true)
                    .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)
                    values[2] = page2
                }
                else {
                    for (i=0; i < guild.points.systems.length; ++i) {
                        console.log(i)
                       const found = guild.points.systems[i]
                        values[i + 2] = new MessageEmbed()
                        .setTitle(`${found.name} System`)
                        .setDescription('Systems are not currently editable.')
                        .addField('Users', found.users.length, true)
                        .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)
        
                    }
                }
                return values
            }
            const firstpage = new MessageEmbed()
            .setTitle('Points Menu')
            .setDescription('Use the pagination arrow to view each of your points one at a time.')
            .addField('Status', pntstatus)
            .addField('Point Systems', `\`${points.systems.map(sys => `${sys.name} - Users: ${sys.users.length}`).join(', ')}\``, true)
            const arrayToRun = guild.points.systems
            return await pagination(bot, message, args, guild, firstpage, getSystem, arrayToRun)
        }
    }
    if (args[1]) {
    const pointconfig = require('./pointsconfig')
    return await pointconfig(bot, message, args, guild)
    }
}
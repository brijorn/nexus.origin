const roleChange = require('../../../lib/role')
const editStartPrompt = require('../../../prompt/editStartPrompt')
const editprompt = require('../../../prompt/editprompt')
const embed = require('../../embed')
const parserole = require('./parserole')
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')
const substring = require('../../substring')
module.exports = async (bot, message, args, guild) => {
    const start = await editStartPrompt(message, embed('Moderation Role', 'Would you like to set custom behaviors such as `multiple roles`, `between two roles` or `>role`?\n\nRespond `y` or `n`\nRespond **cancel** to cancel.', guild))
    start.content = start.content.toLowerCase()
    
    if (start.content === 'n') {
        start.message.delete({ timeout: 0 })
    const roleChange = require('../../../lib/role')
    return await roleChange(bot, message, args, guild, guild, 'moderation', 'modrole', 'ModRole', 'array')
    }
    if (start.content === 'y') {
        const ques = embed('Moderation Role', 'What would you like to set the moderation role to?\n' +
        '\nTo give multiple roles, seperate the values with a comma, if you want to make commands usable by anyone above a certain role you can use `greaterthan(role-id)`**this only supports role id**'
        + '\nTo clear your current moderation roles with the new one include `--clear` after listing the roles\n\nFor every role-name I cannot find, I will create a role.\nRespond **cancel** to cancel.', guild)
        let what = await editprompt(message, start.message, ques, 'lower')
        let notfound = []
        let createdRoles = []
        let newroles = []
        let betweens = []

        if (!what) return
        let extra = 'none'
        if (what.includes('--')) {
            extra = what.substring(what.lastIndexOf('--'))
            what = what.split('--')[0]
        }
            let roles = what.split(',')
            roles = roles.filter(v=>v!='')
            roles = roles.map(p => p.trim())
            
            for (i=0; i < roles.length; i++) {
                ele = roles[i]
                if (ele.startsWith('--')) return
                if (ele.startsWith('greaterthan')) {
                    ele = ele.replace( /^\D+/g, '')
                    ele = ele.substring(0, (ele.length) - 1)
                    if (!message.guild.roles.cache.get(ele)) notfound.push(ele)
                    else newroles.push(`greaterthan(${ele})`)
                }
                else {
                    const role = await parserole(message, i, roles, ele, newroles, notfound, createdRoles)
                    if (role.status === 'found') newroles.push(role.roleid)
                    if (role.status === 'not found') notfound.push(role.roleid)
                    if (role.status === 'created') {
                        createdRoles.push(role.roleid)
                        newroles.push(role.roleid)
                    }
                }
            }
    let desc = (newroles.length > 0)? `Successfully bound the following roles:\n${newroles.map(t => {
        if (t.startsWith('greater')) {
            let num = t.replace( /^\D+/g, '')
            num = num.substring(0, (num.length) - 1)
            const name = message.guild.roles.cache.get(num)
            return `${t} - ${name}`

        }
        else {
            const name = message.guild.roles.cache.get(t)
            return `${t} - ${name}`
        }
    }).join(', ')}` : 'No roles were successfully bound'
    desc += (createdRoles.length > 0)? `\n**Created Roles**:\n${createdRoles.map(t => {
        const name = message.guild.roles.cache.get(t)
        return `${t} - ${name}`
    }).join(', ')}` : ''
    desc += (notfound.length > 0)? `\n**Not Found Roles**:\n${notfound.map(t => {
        return `${t}`
    }).join(', ')}` : ''
    const finished = new MessageEmbed()
    .setTitle('Moderation Roles Bound')
    .setDescription(desc)
    .setFooter(guild.embedInfo.footer, guild.embedInfo.footerlogo)
    .setColor(config.success)
    start.message.edit(finished)
    if (extra === '--clear') {
        guild.moderation.modrole = newroles
    }
    else guild.moderation.modrole = guild.moderation.modrole.concat(newroles)
    guild.markModified('moderation')
    await guild.save()
}
}
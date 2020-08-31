const Discord = require('discord.js')
const embed = require('../embed')
const config = require('../../config.json')
const fetch = require('node-fetch')
const guildModel = require('../../models/guildModel/guild')

module.exports = async (bot, message, msgToEdit, groupid, guild) => {

    let oldbinds = guild.roleBinds.find(o => o.main === true || o.id === groupid)
    const newbindsObj = {
        Id: groupid,
        main: true,
        binds: [],
    }
    await guild.save()
    const search = await fetch(`https://groups.roblox.com/v1/groups/${groupid}/roles`).then(response => response.json())
    .then(async bod => {
        const body = bod.roles
        const slicer = body.splice(0, 1)
        body.sort(function(a, b){return b-a})
        const roles = body
        await roles.forEach(element => {
            // Epic Description Role Merging Contraption 2020
            const cooldescriptionthing = embed('none', `Merging role \`${element.name}\``, guild)
            msgToEdit.edit(cooldescriptionthing)
            // Create the shit if it cant find the shit
            if (!message.guild.roles.cache.find(arole => arole.name === element.name)) {
                bot.guilds.cache.get(message.guild.id).roles.create({
                data: {
                    name: element.name
                },
                reason: 'Nexus Origin Verification Setup',
            }).then(async darole => {
                        // Creating and Saving Roles as Objects and praying this stupid method works
                        const RoleObj = {
                            rank: element.rank,
                            rankName: element.name,
                            nickname: 'default',
                            roles: [darole.id],
                            hierarchy: 1,
    
                        }
                        newbindsObj.binds.push(RoleObj)

            })
        }
        if (message.guild.roles.cache.find(role => role.name === element.name)) {
            const role = message.guild.roles.cache.find(role => role.name === element.name).id
                    // Creating and Saving Roles as Objects and praying this stupid method works
                    const RoleObj = {
                        rank: element.rank,
                        rankName: element.name,
                        nickname: 'default',
                        roles: [role],
                        hierarchy: 1,

                    }
                    newbindsObj.binds.push(RoleObj)

        }
        });
        return roles.length
    })
    guild.roleBinds.splice(guild.roleBinds.indexOf(oldbinds), 1)
    guild.roleBinds.push(newbindsObj)
    guild.markModified('roleBinds')
    await guild.save()
    console.log(guild.roleBinds)
    return search
}
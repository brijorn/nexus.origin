const { getIdFromUsername, getUsernameFromId } = require("noblox.js")
const { success, failure } = require('../../../config.json')
const embed = require("../../embed")
const { MessageEmbed } = require("discord.js")

module.exports = async (bot, message, args, guild, system, systemname, type, users, points, msgToEdit) => {
    type = (type === 'a') ? 'add' : type
    type = (type === 'r') ? 'remove' : type
    const newusers = []
    const notfound = []
    let safe = true
        users = users.split(',')
        if (users.length > 1) users = users.filter(v=>v!='')
        if (users.length >= 1) {
            for (var i = 0; i < users.length; i++) {
                let id = undefined
                try {

                        id = await getIdFromUsername(users[i])
                }
                catch {
                    id = undefined
                    notfound.push(users[i])
                }
                if (id !== undefined) newusers.push(id)
            }
        }
    if (type === 'add') {
        newusers.forEach(async auser => {
            if (system.users.find(one => one.userId === auser)) {
                const user = system.users.find(one => one.userId === auser)
                user.points = user.points + points
                guild.markModified('points')
                guild.points.systems.find(one => one.name === systemname).users.push(userObj)
                guild.markModified('points')
            }
            if (!system.users.find(one => one.userId === auser)) {
                return 
            }
        })
        await guild.save()
        const finished = []
        for (var i = 0; i < newusers.length; i++) {
            const id = await getUsernameFromId(newusers[i])
            .catch(() => {return message.channel.send(`Could not find the roblox user ${newusers[i]}`)})
            finished.push(id)
        }
        if (newusers.length >= 1) {
            const finmap = finished.map(each => `${each}`).join(',')
        msgToEdit.edit(embed('Points Updated', `Sucessfully updated the points for the given users:\n\`${finmap}\``, guild, success))
        const currentpoints = finished.map(e => {
            const currency = system.currency
            return `${e} - ${system.users.find(f => f.userId === newusers[finished.indexOf(e)]).points} ${currency}`
        }).join('\n')
        const userstate = new MessageEmbed()
        .setTitle('Current Points')
        .setDescription(await currentpoints)
        .setFooter('Origin Points')
        .setColor('#03b1fc')
        message.channel.send(userstate)
        }
        if (notfound.length > 0) {
        const notfoundmap = notfound.map(e => `${e}`).join(', ')
        const notfoundembed = new MessageEmbed()
        .setDescription(`The following users were not found: \`${notfoundmap}\``)
        .setFooter('Origin Points', guild.embedInfo.footerlogo)
        message.channel.send(notfoundembed)
        }
    }
    if (type === 'remove') {
        newusers.forEach(async auser => {
            if (system.users.find(one => one.userId === auser)) {
                const user = system.users.find(one => one.userId === auser)
                user.points = user.points - points
                guild.markModified('points')
            }
            if (!system.users.find(one => one.userId === auser)) {
                newusers.splice(newusers.indexOf(auser), 1)
                return notfound.push(auser)
            }
        })
        await guild.save()
        const finished = []
        for (var i = 0; i < newusers.length; i++) {
            const id = await getUsernameFromId(newusers[i])
            .catch(() => {return message.channel.send(`Could not find the roblox user ${newusers[i]}`)})
            finished.push(id)
        }
        if (newusers.length >= 1) {
            const finmap = finished.map(each => `${each}`).join(',')
        msgToEdit.edit(embed('Points Updated', `Sucessfully updated the points for the given users:\n\`${finmap}\``, guild, success))
        const currentpoints = finished.map(e => {
            const currency = system.currency
            return `${e} - ${system.users.find(f => f.userId === newusers[finished.indexOf(e)]).points} ${currency}`
        }).join('\n')
        const userstate = new MessageEmbed()
        .setTitle('Current Points')
        .setDescription(await currentpoints)
        .setFooter('Origin Points')
        .setColor('#03b1fc')
        message.channel.send(userstate)
        }
        if (notfound.length > 0) {
            if (newusers.length < 1) {
                msgToEdit.edit(embed('Error', 'None of the given users were able to be modified.', guild, failure))
            }
        const notfoundmap = notfound.map(e => `${e}`).join(', ')
        const notfoundembed = new MessageEmbed()
        .setDescription(`The following users were not found: \`${notfoundmap}\``)
        .setFooter('Origin Points', guild.embedInfo.footerlogo)
        message.channel.send(notfoundembed)
        }
    }
}
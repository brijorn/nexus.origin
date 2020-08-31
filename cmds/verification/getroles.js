const roleCheck = require('../../functions/verifyFunctions/roleAddCheck')
const verificationModel = require('../../models/verificationModel/verification')
const rbx = require('noblox.js')
const Discord = require('discord.js')
const config = require('../../config.json')
module.exports.run = async (bot, message, args, guild) => {
    const checkforAccount = await verificationModel.exists({ userID: message.author.id })

    if (checkforAccount === true) {
        const user = await verificationModel.findOne({ userID: message.author.id})
        const roleAdd = await roleCheck(bot, message, guild)
        const newUsername = await rbx.getUsernameFromId(user.primaryAccount)
        const Verified = new Discord.MessageEmbed()
        .setDescription(`You were successfully verified as ${newUsername}`)
        .setColor(config.success)
        if (roleAdd !== undefined) {
            if (roleAdd.rolesAdded.length !== 0) {
                const eachrole = roleAdd.rolesAdded.map(each => `${each}`)
                Verified.addField('Roles Added', eachrole)
            }
            if (roleAdd.rolesRemoved.length !== 0) {
                const eachrole = roleAdd.rolesRemoved.map(each => `${each}`)
                Verified.addField('Roles Removed', eachrole)
            }
        }
        message.channel.send(Verified)
}
    if (checkforAccount === false) return message.channel.send(`Run the ${guild.prefix}verify command first before doing this.`)
}

module.exports.help = {
    name: 'getroles',
    module: 'verification',
    description: 'Updates your roles with the linked grouped and binds.',
    cooldown: 3,
}
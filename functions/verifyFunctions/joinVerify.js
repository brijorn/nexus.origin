const embed = require('./../embed')
const verificationModel = require('./../../models/verificationModel/verification')
const rbx = require('noblox.js')
const roleCheck = require('../../functions/verifyFunctions/roleAddCheck')
const fetch = require('node-fetch')
module.exports = async (member, guild) => {
    const answer = await verificationModel.exists({ userID: member.id })
    if (answer === true) {
        console.log('here')
        const user = await verificationModel.findOne({ userID: member.id })
        const username = await rbx.getUsernameFromId(user.primaryAccount)
        member.send(embed('Auto Verification', 'You have successfully been verified in ' + `**${member.guild.name}** as ` + username, guild))
        await roleCheck(undefined, undefined, guild, 'upd', member)
       if (guild.verificationSettings.nickname === true) {
           const nicknaming = require('../../functions/verifyFunctions/nicknaming')
           return await nicknaming(member, guild, username)
       }
    }
    if (answer === false) {
        fetch(`https://api.blox.link/v1/user/${member.id}`).then(async bod => {
            const body = await bod.json()
    
            if (body.status === "error") return
            else {
                const verificationcreate = require('../../models/verificationModel/verificationCreate')
                await verificationcreate(member.id, body.primaryAccount)
                const roleCheck = require('../../functions/verifyFunctions/roleAddCheck')
                const roleAdd = roleCheck(undefined, undefined, guild, 'upd', member)
                if (guild.vericationSettings.nickname === true) {
                    const nicknaming = require('../../functions/verifyFunctions/nicknaming')
                    return await nicknaming(member, guild, username)
                }
                member.send(`Welcome to **${member.guild.name}** you were successfully verified with Bloxlink.`)
            }
        })
    }
}
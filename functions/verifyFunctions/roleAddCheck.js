const Discord = require('discord.js')
const embed = require('../embed')
const fetch = require('node-fetch')
const rbx = require('noblox.js')
const usr = require('../../lib/roblox/user/index')
const verificationModel = require('../../models/verificationModel/verification')
module.exports = async (bot, message, guild, type='reg', extra='N/A') => {
    const member = (type === 'reg') ? message.member : extra
    const id = (type === 'reg') ? message.author.id : extra.id
    const guildLoc = (type === 'reg') ? message.guild : extra.guild
    let rolesAdded = []
    let addedRole = ''
    let rolesRemoved = []
    let currentrole = undefined
    if (guild.verificationSettings.verifiedRole !== 'none') {
        if (!member.roles.cache.has(guild.verificationSettings.verifiedRole)) {
            member.roles.add(guild.verificationSettings.verifiedRole)
            rolesAdded.push(member.guild.roles.cache.get(guild.verificationSettings.verifiedRole).name)
        }
    }
    let rouser = await verificationModel.findOne({ userID: id})
    rouser = rouser.primaryAccount

    // Check if they own any assets
    async function ownedAssets(robloxUser, user, array) {
        for (i=0; i < array.length; i++) {
            const asset = array[i]
            if (member.roles.cache.has(asset.roleId) && message.guild.roles.cache.get(asset.roleId)) {
                const owns = await usr.ownsAsset(robloxUser, asset.assetID)
                if (owns = true) { user.roles.add(asset.roleId); rolesAdded.push(guildLoc.cache.get(asset.roleId).name)}
            }
        }
    }
    if (guild.assetBinds.length > 0) {
        await ownedAssets(rouser, member, guild.assetBinds)
    }
    if (guild.gamepassBinds.length > 0) {
        await ownedAssets(rouser, member, guild.gamepassBinds)
        }
        // Here begins Shit Hole

        // Get their rank in the linked group
        let currentRank = 0
        // If their In the group
        for (b=0; b < guild.roleBinds.length; b++) {
            console.log('inside')
            const obj = guild.roleBinds[b]
            const roles = obj.binds
            const rank = await rbx.getRankInGroup(obj.Id, rouser)
            let rankname = rbx.getRankNameInGroup(obj.id, rouser)
            const objrank = roles.find(a => a.rank === rank)
            console.log(objrank)
            if (!objrank) return
            if (rank > 0 && objrank && !member.roles.cache.find(r => r.id === objrank.roleId)) {
                const oldrole = member.roles.cache.find(r => roles.includes(r.id))
                try { member.roles.add(objrank.roleId); rolesAdded.push(guildLoc.roles.cache.get(objrank.roleId).name)}
                catch { message.channel.send(embed('Error', `Failed to give you the role with the Id of ${objrank.roleId}, If you can, make sure this role exists.`, guild))}
            }
            else if (obj.main === true && member.roles.cache.find(r => r.id === objrank.roleId)) {currentrole = guildLoc.roles.cache.get(objrank.roleId).name; currentRank = rank}
            if (!objrank) currentrole = null 

        }
       const roleInfoName = (currentRank === 0) ? 'Not In Group' : currentrole
       const roleInfo = {
           rank: currentRank,
           groupRankInfo: roleInfoName,
       }
    return {
        rolesAdded,
        rolesRemoved,
        roleInfo,
    }
}
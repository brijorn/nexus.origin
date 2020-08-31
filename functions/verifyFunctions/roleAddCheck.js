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
    // Highest Role Information

    let highestroleobj = ''
    let highestrolehier = 0
    let highestrolename = 'Guest'
    let highestroletype = ''

    async function setHighest(obj, asset=false, name) {
        highestrolehier = obj.hierarchy
        highestroleobj = obj
        if (asset === true) {highestrolename = await rbx.getProductInfo(obj.assetId); highestroletype='asset'}
        if (asset === false) {highestrolename = name; highestroletype='rank'}
        return
    }
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
                if (asset.hierarchy > highestrolehier) setHighest(asset, true)
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

        let currentRank = 0
        for (b=0; b < guild.roleBinds.length; b++) {
            const obj = guild.roleBinds[b]
            const roles = obj.binds
            const rank = await rbx.getRankInGroup(obj.id, rouser)
            let rankname = await rbx.getRankNameInGroup(obj.id, rouser)
            const objrank = roles.find(a => a.rank === rank)
            if (!objrank) return
            if (rank > 0 && objrank && !member.roles.cache.find(r => r.id === objrank.roleId)) {
                if (objrank.hierarchy >= highestrolehier) setHighest(objrank, false, rankname)
                const toRemove = roles.find(r => r.roles.find(o => member.roles.cache.has(o) === true))

                if (toRemove && toRemove.roles.length > 0) { try { toRemove.roles.forEach(r => { if (objrank.roles.includes(r)) return; member.roles.remove(r); rolesRemoved.push(guildLoc.roles.cache.get(r).name) }); } catch(err) {console.log(err); message.channel.send(embed('Error', `Failed to remove Roles, this is usually a permissions error.`, guild, 'failure', false, true))} }
                try { objrank.roles.forEach(r => {
                    if (message.member.roles.cache.get(r)) return
                    member.roles.add(r); 
                    rolesAdded.push(guildLoc.roles.cache.get(r).name)});}
                catch { message.channel.send(embed('Error', `Failed to give you one of the following roles: ${objrank.roles.map(e => `<@&${e}>`).join(', ')}, If you can, make sure this role exists.`, guild, 'failure', false, true))}
            }
            else if (obj.main === true && member.roles.cache.find(r => r.id === objrank.roleId)) {currentrole = guildLoc.roles.cache.get(objrank.roleId).name; currentRank = rank}
            if (!objrank) currentrole = null 

        }
        const roleInfo = {
            type: highestroletype,
            name: highestrolename,
            obj: highestroleobj

        }
    return {
        rolesAdded,
        rolesRemoved,
        roleInfo,
    }
}
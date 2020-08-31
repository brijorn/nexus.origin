const guildModel = require("../models/guildModel/guild")
const logging = require('./logging')
const embed = require('../functions/embed')
const { message } = require("noblox.js")
const { get } = require("mongoose")
async function createUser(guild, user, obj) {
    const userObj = {
        id: user.id,
        warns: [],
        kicks: [],
        bans: [],
        mutes: []
    }
    guild.moderation.moderations.push(userObj)
    guild.markModified('moderation')
    await guild.save()
}
async function time(message, guild, user, type, obj, time)  {
    const ongoingObj = {
        id: user.id,
        case: obj.case,
        type: type,
        moderator: obj.moderator,
        user: obj.user,
        until: Date.now() + time
    }
    await guild.moderation.ongoing.push(ongoingObj)
    guild.markModified('moderation')
    await guild.save()
    setTimeout(async () => {
        if (type === 'ban') {
            try {
                message.guild.members.unban(user.id, 'Moderation Time Expired')
                const find = await guild.moderation.ongoing.find(o => o.id === user.id)
                guild.moderation.ongoing.splice(guild.moderation.indexOf(find), 1)
                guild.markModified('moderation')
                await guild.save()
            }
            catch {
                const find = await guild.moderation.ongoing.find(o => o.id === user.id)
                guild.moderation.ongoing.splice(guild.moderation.indexOf(find), 1)
                guild.markModified('moderation')
                await guild.save()
                return
            }

        }
    }, time)
} 

async function updateUser(message, guild, user, type, obj, until=0) {
    guild.moderation.cases++
    const moderations = guild.moderation.moderations
    if (!moderations.find(o => o.id === user.id)) await createUser(guild, user)
    const modUser = moderations.find(o => o.id === user.id)
    guild.markModified('moderation')
    await guild.save()
    if (until > 0) time(message, guild, user, 'ban', obj, until)
}
let toDelete = []
async function query(bot)  {
    const finder = await guildModel
    .find({ moderation: {$exists: true}}).
    where("moderation.enabled").equals(true).
    where("moderation.ongoing.0").exists(true).
    exec();
    // For Each Guild
    for (i=0; i < finder.length; i++) {
        if (!finder[i]) return
        const guild = finder[i]
        const ongoing = guild.moderation.ongoing
        // Query the ongoing moderations in the guild
        for (e=0; e < ongoing.length; e++) {
            if (!ongoing[i]) return
            const item = ongoing[i]
            // Check if the document time is expired, if so unmute/unban the user and delete them from ongoing
            await queryCheck(bot, item, guild, e)
        }
        // Deleting after checking if their expired or not so I dont mess up the placements
        for (o=0; o < toDelete.length; o++) {
            ongoing.splice(toDelete[o], 1)
        }
        guild.markModified('moderation')
        await guild.save()
    }
}
async function queryCheck(bot, item, guild, place) {
    const getGuild = bot.guilds.cache.get(guild.guildID)
    if (item.until <= Date.now()) {
        if (item.type === 'ban') {
            try {
                getGuild.members.unban(item.id)
                toDelete.push(place)
            }
            catch {
                toDelete.push(place)
            }
            if (guild.moderation && guild.moderation.modlog !== 'none') {
                try {
                    getGuild.channels.cache.get(guild.moderation.modlog).send(embed('Member Unbanned', `${user} has been unbanned\n**Reason:** Moderation Time Expired`, guild))
                }
                catch {
                    return
                }
            }
        }
    }
    else {
        const expiry = item.until - Date.now()
        setTimeout(() => {
            if (item.type === 'ban') {
                toDelete.push(place)
                getGuild.members.unban(item.id)
                if (guild.moderation && guild.moderation.modlog !== 'none') {
                    try {
                        getGuild.channels.cache.get(guild.moderation.modlog).send(embed('Member Unbanned', `${user} has been unbanned\n**Reason:** Moderation Time Expired`, guild))
                    }
                    catch {
                        return
                    }
                }
            }
            if (item.type === 'mute') {
                try {
                    getGuild.members.cache.get(item.id).roles.remove(guild.moderation.mutedRole)
                    toDelete.push(place)
                }
                catch {
                    return
                }
                if (guild.moderation && guild.moderation.modlog !== 'none') {
                    try {
                        getGuild.channels.cache.get(guild.moderation.modlog).send(embed('Member Unmuted', `${user} has been unbanned\n**Reason:** Moderation Time Expired`, guild))
                    }
                    catch {
                        return
                    }
                }
            }
        }, expiry)
    }
}

querying = { query }
userUpd = { createUser, updateUser }
module.exports = { userUpd, querying }
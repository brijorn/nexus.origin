const GuildModel = require('../../models/guildModel/guild')
const embed = require('../embed')
const config = require('../../config.json')
const { editprompt } = require('../../prompt/index')
const bindCheck = require('../../functions/bindFunctions/bindCheck')
const rbx = require('noblox.js')
const fetch = require('node-fetch')
module.exports = async (bot, message, type, msgToEdit, guild) => {
    item = type.toLowerCase()
    const numbers = new RegExp('^[0-9]+$');
    const Types = ['asset', 'gamepass', 'group', 'rank']
    if (!Types.includes(item)) return message.channel.send(embed('none', 'Please give a valid type of bind.', guild, config.failure))

    if (item === 'asset') {
       const idask = embed('Binding', 'What is the ID of the Asset you wish to bind?\n\n Respond **cancel** to cancel.', guild)
       const id = await editprompt(message, msgToEdit, idask)
       if (id === 'cancel') return message.channel.send(embed('none', 'Binding Cancelled.', guild, config.failure))
       if (numbers.test(id) === false) return message.channel.send(embed('none', 'Error: The given value is not a number.', guild,  config.failure))
       const roleask = embed('Binding', 'What role would you like to bind this to?', guild)
       const role = await editprompt(message, msgToEdit, roleask, 'lower')
       const bindChecker = await bindCheck(message, role)
       const info = await rbx.getProductInfo(id)
       .catch(() => {
           message.channel.send(embed('none', 'There was an error fetching the given assetId.', guild, config.failure))
       })
       const rolename = message.guild.roles.cache.get(bindChecker).name
       const finished = embed('none', `Successfully bound **${info.Name}** by ${info.Creator.Name} to ${rolename}.`, guild)
       msgToEdit.delete({ timeout: 3000 })
       await GuildModel.findOne({ guildID: message.guild.id }, async function(err, info) {
           if (!info) {return message.reply('error mate sorry')}
           else {
               const assetObj = {
                   name: rolename,
                   assetID: id,
                   roleID: bindChecker,
               }
               info.assetBinds.push(assetObj)
               await info.save()
               
           }
       })

    }
    if (item === 'gamepass') {
        const idask = embed('Binding', 'What is the ID of the gamepass?', guild)
        const id = await editprompt(message, msgToEdit, idask)
        if (numbers.test(id) === false) return message.channel.send(embed('none', 'Error: The given value is not a number.', guild))
        const roleask = embed('Binding', 'What role would you like to bind this to?', guild)
        const role = await editprompt(message, msgToEdit, roleask, 'lower')
        const bindChecker = await bindCheck(message, role)
        const info = await fetch(`https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${id}`).then(response => response.json())
       .then(body => {
           return body
       })
       .catch(() => {
           message.channel.send(embed('none', 'There was an error fetching the given assetId.', guild, config.failure))
       })
        const rolename = message.guild.roles.cache.get(bindChecker).name
        const finished = embed('none', `Successfully bound **${info.Name}** by ${info.Creator.Name} to ${rolename}.`, guild)
        msgToEdit.delete({ timeout: 3000 })
        await GuildModel.findOne({ guildID: message.guild.id }, async function(err, info) {
            if (!info) {return message.reply('error mate sorry')}
            else {
                const gamepassObj = {
                    name: rolename,
                    assetID: id,
                    roleID: bindChecker,
                }
                info.gamepassBinds.push(gamepassObj)
                await info.save()
                
            }
        })
    }
    if (item === 'rank') {
        if (!guild.robloxToken) return msgToEdit.edit(embed('Token Error', 'You need a .ROBLOSECURITY of an account with ranking perms in your group for this command.', guild, config.failure))
        const theTypeask = embed('Binding', 'What type of item are you binding to the rank?\n\nOptions: `gamepass` `asset`', guild)
        const theType = await editprompt(message, msgToEdit, theTypeask)
        const Type = theType.toLowerCase()
        const bindRank = require('./bindRank')
        const idask = embed('Binding', 'What is the ID of the Item?', guild)
        const ID = await editprompt(message, msgToEdit, idask)
    }

}
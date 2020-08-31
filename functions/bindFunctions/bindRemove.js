const embed = require('../embed')
const { MessageEmbed } = require('discord.js')
const editStartPrompt = require('../../prompt/editStartPrompt')
const editprompt = require('../../prompt/editprompt')
const bindRemover = require('./bindRemover')
module.exports = async (bot, message, args, guild) => {
    let start = undefined
    if (!args[1]) {
    const roleBindMap = guild.Binds.map(each => `${each.rank} - ${each.rankName}`).join(', ')
    const assetBindMap = guild.assetBinds.map(each => `${each.assetID} - ${each.name}`).join(', ')
    const gamepassBindMap = guild.gamepassBinds.map(each => `${each.assetID} - ${each.name}`).join(', ')
    const rankBindMap = guild.rankBinds.map(each => `${each.assetID} - ${each.name}`).join(', ')
    const mainPage = new MessageEmbed()
    .setTitle('Guild Bindings')
    .setDescription('Give a binding type to remove a binding from it.')
    .addField('Linked Group Binds', `\`${roleBindMap}\``)
    .addField('Asset Binds', `\`${assetBindMap}\``)
    .addField('Gamepass Binds', `\`${gamepassBindMap}\``)
    .addField('Rank Binds', `\`${rankBindMap}\``)
    start = await editStartPrompt(message, mainPage)
    if (start.content === 'cancel') {
        await start.message.delete({ timeout: 50 })
        return message.channel.send('Cancelled.')
    }
    }
    const ques = (!args[1]) ? start.message : await message.channel.send(embed('Bind Removal', 'Bind Removal', guild, '#'))
    let res = (!args[1]) ? start.content : args

    if (res.includes('linked')) res = 'roleBindings'
    if (res.includes('asset')) res = 'assetBinds'
    if (res.includes('gamepass')) res = 'gamepassBinds'
    if (res.includes('rank')) res = 'rankBinds'
    let mapper = undefined
    if (res === 'assetBinds' || res === 'gamepassBinds') {
        let next = undefined
        if (!args[2]) {
            const name = (res === 'assetBinds') ? 'Asset Binds' : 'Gamepass Binds'
            mapper = guild[res].map(each => `${each.assetID} - ${each.name}`).join(', ')
            const mapped = embed(name, `\`${mapper}\``, guild, '#')
            next = await editprompt(message, ques, mapped)
        }
        else {
            next = args[2]
        }
        return await bindRemover(bot, message, guild, ques, res, name, next, 'reg')
    }
    if (res === 'rankBinds') {
        let next = undefined
        const name = 'Rank Binds'
        if (!args[2]) {
            mapper = guild[res].map(each => `${each.assetID} - ${each.name}`).join(', ')
            const mapped = embed(name, `\`${mapper}\``, guild, '#')
            next = await editprompt(message, ques, mapped)
        }
        else {
            next = args[2]
        }
        return await bindRemover(bot, message, guild, ques, res, name, next, 'rank')
    }
}
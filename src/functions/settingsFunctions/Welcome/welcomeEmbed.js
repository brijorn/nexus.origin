const { Message, Client }  = require('discord.js')
const embed = require('../../embed')
const { editStart, editPrompt } = require('../../../prompt/')
const functions  = require('../../../db/welcome/schema')
/**
 * 
 * @param { Client } bot 
 * @param { Message } message 
 * @param { Array } args 
 * @param { Object } guild 
 * @param { Object } welcome 
 */
module.exports = async function(bot, message, args, guild, welcome) {
    const value = args[2].toLowerCase()
    if (value === 'toggle') return await functions.toggle(guild, message, welcome)
    if (!args[3]) {
        let ques = embed('Welcome Embed Configuration',
        `What would you like to set the ${value} to?`, guild, '', false, false)
        const option = await editStart(message, ques)
        if (await inclusive(value, option.message) === false) return
        welcome.embed[value] = option.content
        await functions.update(message, welcome)
        return message.channel.send(embed('Welcome Embed Configured',
        `Successfully set the ${value} to \`${option.content}\``, guild, 'success', false, false))
    }
    if (await inclusive(guild, value) === false) return
    else welcome.embed[value] = args.slice(3).join(" ")
    await functions.update(message, welcome)
    return message.channel.send(embed(
        'Welcome Embed Configured',
        `Successfully set the ${value} to \`${args.slice(3).join(" ")}\``,
        guild, 'success', false, false
    ))
}
/**
 * 
 * @param { String } word 
 * @param { Message } msgToEdit 
 */
async function inclusive(guild, word, msgToEdit) {
    const options = [
        'title',
        'description',
        'color',
        'footer',
        'footerlogo',
        'thumbnail',
        'image',
        'toggle'
    ]
    if (!options.includes(word)) {
        const msg = embed(
            'none',
            `Invalid option given, Valid Options:\n \`${options.map(e => `${e}`).join(', ')}\``,
            guild, false, true
        )
        if (msgToEdit) await msgToEdit.edit(msg)
        else await message.channel.send(msg)
        return false
        }
    else return true
}
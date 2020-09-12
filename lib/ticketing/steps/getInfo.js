const { MessageEmbed, Message } = require('discord.js')
const embed = require('../../../functions/embed')
const prompt = require('../../../prompt/')
/**
 * 
 * @param { Message } message 
 * @param { Object } guild 
 * @param { Array } args 
 * @param { Object } panel 
 */
module.exports = async (message, guild, information, panel) => {
    let state = false
    let error = false
    if (information.type === 'command' && panel.command_dm_prompt === true) {
        if (panel.command_require_title === true || panel.command_require_description === true) {
            const check = await message.channel.send(embed('none',
            'Check your DMS to continue the ticket creation.', guild, '', false, false))
            check.delete({ timeout: 10000 })
        }
    }
    // Check if its command or reaction create and get the settings for that type
    const reqtitle = (information.type === 'reaction') ? panel.create_require_title : panel.command_require_title
    const reqdesc = (information.type === 'reaction') ? panel.create_require_title : panel.command_require_description
    const type = (information.type === 'reaction') ? panel.create_dm_prompt : panel.command_dm_prompt
    const prompter = (type === true) ? prompt.dmprompt : prompt.prompt
    // Declaration of Independence

    let title = 'None'
    let description = 'None'
    let start = undefined
    // First Amendment of Title
    if (reqtitle === true ) {
        const content = new MessageEmbed()
        .setTitle('Give your ticket a title')
        .setDescription('Give the subject of your ticket.\n\nRespond **cancel** to cancel')
        .setFooter((guild.embed.footer !== 'none') ? guild.embed.footer : '', (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '')
        try {
            start = await prompter(message, content)
        }
        catch {
            error = true
            if (type === true) return message.channel.send('Error DMing user.')
            else return message.channel.send('Error prompting. This is likely an embed permission error.')

        }
        if (start.toLowerCase() === 'cancel') {error = true; return message.channel.send('Cancelled')}
        if (!start) {error = true; return message.channel.send('Ticket Creation Cancelled due to no response')}
        title = start
        start = undefined
    }
    if (reqdesc === true ) {
        const content = new MessageEmbed()
        .setTitle('Give a Description')
        .setDescription('Give a description of the subject of your ticket, the more detailed the better.\n\nRespond **cancel** to cancel')
        .setFooter((guild.embed.footer !== 'none') ? guild.embed.footer : '', (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '')
        try {
            start = await prompter(message, content)
        }
        catch {
            error = true
            if (type === true) return message.channel.send('Error DMing user.')
            else return message.channel.send('Error prompting. This is likely an embed permission error.')

        }

        if (start.toLowerCase() === 'cancel') {error = true; return message.channel.send('Cancelled')}
        if (!start) {error = true; return message.channel.send('Ticket Creation Cancelled due to no response')}
        description = start
        start = undefined
    }
    // Check if the dunce didnt respond or cancelled

    if (error === true) return state
    state = true
    const infoObj = {
        title: title,
        description: description
    }
    return {
        infoObj,
        state,
    }
}
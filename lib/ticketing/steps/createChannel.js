const { Client, Message, MessageEmbed } = require('discord.js')
const moment = require('moment-timezone')
const embed = require('../../../functions/embed')
const formatEmbed = require('../functions/formatEmbed')
/**
 * @param { Client } bot
 * @param { Message } message 
 * @param { object} info 
 * @param { object } panel 
 */
module.exports = async (message, information, panel, type) => {
    let state = false
    let channel = undefined
    let mainmessage = undefined
    // Get the Category
    let category = message.guild.channels.cache.find(o => o.name === panel.open_category && o.type === 'category')
    // Create the Category If Not Exists
    if (!category) category = await message.guild.channels.create(panel.interface_name, {
        type: "category",
    })
    // Get ticket name and format/replace the placeholders

    const channelname = await format(message, panel, panel.ticket_name)
    try {
        channel = await message.guild.channels.create(channelname, {
            type: "text",
            parent: category.id,
            permissionOverwrites: await createOverwrites(message, panel, type, information),
        })
    }
    catch {
        state = false
        return message.channel.send(embed('Error',
        'Could not create channel, likely a permissions error.', guild, 'failure', false, true))

    }
    // Convert the string to JSON string to JSON
    try {
    let data = JSON.parse(JSON.stringify(panel.open_message))
    // Check for Content field in JSON
    let content = (data.content) ? data.content : ''
    // Create MessageEmbed for first item in embeds array, could loop for multiple embed support
    data = await formatEmbed(data, message, panel, type, information)
    data = new MessageEmbed(data)
    // Send the data to the ticket channel

    mainmessage = await message.guild.channels.cache.get(channel.id).send(content, data)
    await mainmessage.react(panel.close_reaction)
    }
    catch(err) {
        return message.channel.send('Error Creating Channel, error:' + err.message)
    }
    const channelObj = {
        channelid: channel.id,
        mainmessage: mainmessage.id
    }
    state = true
    return {
        channelObj,
        state
    }
}
// Le functiones

async function format(message, panel, name) {
    const formats = require('../functions/formats.json')
    formats.forEach(e => {
        if (name.includes(e.name)) {
            name = name.replace(new RegExp(e.name, 'g'), eval(e.changeto));
        }
    })
    return name
}

async function createOverwrites(message, panel, type, information) {
    const overwrites = []
    // Set @everyone permissions
    overwrites.push({
        id: message.guild.id,
        deny: (panel.isPublic === true) ? ['SEND_MESSAGES'] : ['VIEW_CHANNEL', 'SEND_MESSAGES']
    })
    // Set ticket creator permissions
    overwrites.push({
        id: message.author.id,
        allow: panel.user_open_permissions,
        deny: panel.user_open_disallowed_permissions
    })

    // Set Support Permissions

        // If it is a claim only set it for the claimer
    if (type === 'support')
    overwrites.push({
        id: information.staffid,
        allow: panel.support_open_permissions,
        deny: panel.support_open_disallowed_permissions
    })

        // If it isnt set permissions for all support_roles
    else {
        panel.support_roles.forEach(r => {
            overwrites.push({
                id: r,
                allow: panel.support_open_permissions,
                deny: panel.support_open_disallowed_permissions
            })
        }
        )
    }
    return overwrites
}
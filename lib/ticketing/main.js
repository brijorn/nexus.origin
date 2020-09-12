const steps = require('./steps')
const panels = require('../../db/ticketing/panel')
const { Message, Client } = require('discord.js')
/**
 * 
 * @param { Client } bot 
 * @param { Message } message 
 * @param { Array } args 
 * @param { Object } guild 
 */
module.exports = async (bot, message, guild, type, supportObj) => {
    // Connect Support Information
    let information = {
        type: type,
    }
    if (supportObj) information = joinObj(past, supportObj)

    // Get the Panel
    const panel = await panels.getPanel(message, 'help')

    // Get Title and Description
    let info = await steps.getInfo(message, guild, information, panel)
    if (info.state === false) return
    // Join
    information = joinObj(information, info.infoObj)

    // Create the channel in the Category
    const channelinfo = await steps.createChannel(message, information, panel, type)
    if (channelinfo.state === false) return
    // Join
    information = joinObj(information, channelinfo.channelObj)

    // Create ticket in the database
    const ticket = await steps.createTicket(bot, message,guild, panel, information, type)
    if (ticket.state === false) return
    // Join
    information = joinObj(information, ticket.ticketObj)

    // Finish
    const finish = await steps.finish(bot, message, guild, panel, information)
    console.log(information)

}

function joinObj(past, newinfo) {
    past = {
        ...past,
        ...newinfo,
    }
    return past
}
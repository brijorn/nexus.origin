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
module.exports = async (bot, message, guild, type, panel, supportObj) => {
    // Connect Support Information
    let information = {
        type: type,
    }
    if (supportObj) information = joinObj(information, supportObj)


    // Get Title and Description
    let info = await steps.getInfo(message, guild, information, panel)
    if (info.state === false) return
    // Join
    information = joinObj(information, info.infoObj)

    // Check which it is
    let createdstate = false
    let createdinfo = ''

    // Create with Claim System
    if (panel.claim_system === true) {
        const claiminfo = await steps.createClaim(message, information, panel)
        if (claiminfo.state === true) createdstate = true
        createdinfo = claiminfo.claimObj
    }
    // Create with Channel
    else {
        const channelinfo = await steps.createChannel(message, information, panel)
        if (channelinfo.state === true) createdstate = true
        createdinfo = channelinfo.channelObj
    }

    if (createdstate === false) return

    // Join
    information = joinObj(information, createdinfo)

    return console.log(information)

    // Create ticket in the database
    let savedstate = false
    let savedinfo = ''
    // Save to awaiting claim
    if (panel.claim_system === true) {
        const ongoinginfo = await steps.createOngoing(bot, message, guild, panel, information)
    }
    // Save to ongoing
    else {
        const ticket = await steps.createTicket(bot, message, guild, panel, information, type)
        if (ticket.state === false) return
    }
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
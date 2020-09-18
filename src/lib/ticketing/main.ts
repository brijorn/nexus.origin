import steps from './steps'
import { Message, Client } from 'discord.js'
import GuildSettings from '../../db/guild/types'
import { Panel } from '../../db/ticketing/types'

module.exports = async (bot: Client, message: Message, guild: GuildSettings, type: any, panel: Panel, supportObj: any) => {
    // Connect Support Information
    let information = {
        type: type,
    }
    if (supportObj) information = joinObj(information, supportObj)


    // Get Title and Description
    let info: any = await steps.getInfo(message, guild, information, panel)
    if (info.state === false) return
    // Join
    information = joinObj(information, info.infoObj)

    // Check which it is
    let createdstate = false
    let createdinfo = ''

    // Create with Claim System
    if (panel.claim_system === true) {
        const claiminfo: any = await steps.createClaim(message, guild, information, panel)
        if (claiminfo.state === true) createdstate = true
        createdinfo = claiminfo.claimObj
    }
    // Create with Channel
    else {
        const channelinfo: any = await steps.createChannel(message, guild, information, panel)
        if (channelinfo.state === true) createdstate = true
        createdinfo = channelinfo.channelObj
    }

    if (createdstate === false) return

    // Join
    information = joinObj(information, createdinfo)


    // Create ticket in the database
    let savedstate: any = false
    let savedinfo: any = {}
    // Save to awaiting claim
    if (panel.claim_system === true) {
        const ongoinginfo = await steps.createOngoing(bot, message, guild, panel, information)
        if (ongoinginfo.state === false) return
        savedinfo = ongoinginfo.ongoingObj
        savedstate = true
    }
    // Save to ongoing
    else {
        const ticket: any = await steps.createTicket(bot, message, guild, panel, information)
        if (ticket.state === false) return
        savedinfo = ticket.ticketObj
        savedstate = true
    }
    if (savedstate === false) return
    // Join
    information = joinObj(information, savedinfo)

    // Finish
    const finish = await steps.finish(bot, message, guild, panel, information)
    console.log(information)

}

function joinObj(past: any, newinfo: any) {
    past = {
        ...past,
        ...newinfo,
    }
    return past
}
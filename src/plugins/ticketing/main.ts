import { FetchedPanel, GuildSettings, Panel } from "@lib/origin";
import { Client, Message } from "discord.js";
import steps from './creation/index'
export default async (bot: Client, message: Message, guild: GuildSettings, type: 'reaction' | 'command', panel: FetchedPanel, supportObj: SupportObject) => {
    // Connect Support Information
    let information = {
        type: type,
    };
    if (supportObj)
        information = joinObj(information, supportObj);
    // Get Title and Description
    let info = await steps.getInfo(message, guild, information, panel) as any;
    if (info.state === false)
        return;
    // Join
    information = joinObj(information, info.infoObj);
    // Check which it is
    let createdstate = false;
    let createdinfo = '';
    // Create with Claim System
    if (panel.claim_system === true) {
        const claiminfo = await steps.createClaim(message, guild, information, panel) as any;
        if (claiminfo.state === true)
            createdstate = true;
        createdinfo = claiminfo.claimObj;
    }
    // Create with Channel
    else {
        const channelinfo = await steps.createChannel(message, guild, information, panel) as any;
        if (channelinfo.state === true)
            createdstate = true;
        createdinfo = channelinfo.channelObj;
    }
    if (createdstate === false)
        return;
    // Join
    information = joinObj(information, createdinfo);
    // Create ticket in the database
    let savedstate: boolean = false;
    let savedinfo: any = {};
    // Save to awaiting claim
    if (panel.claim_system === true) {
        const ongoinginfo = await steps.createOngoing(bot, message, guild, panel, information);
        if (ongoinginfo.state === false)
            return;
        savedinfo = ongoinginfo.ongoingObj;
        savedstate = true;
    }
    // Save to ongoing
    else {
        const ticket = await steps.createTicket(bot, message, guild, panel, information) as any;
        if (ticket.state === false) return;
        savedinfo = ticket.ticketObj;
        savedstate = true;
    }


    if (savedstate as any === false)
        return;
    // Join
    information = joinObj(information, savedinfo);
    // Finish
    const finish = await steps.finish(bot, message, guild, panel, information);
    console.log(information);
};
function joinObj(past: any, newinfo: any) {
    past = {
        ...past,
        ...newinfo,
    };
    return past;
}

interface SupportObject {
    
}
import { Message, MessageEmbed } from "discord.js";
import { Panel } from "../../typings/origin.d";
import { OriginMessage } from "../../lib/extensions/OriginMessage";

export default async (message: OriginMessage, panel: Panel, type: 'command' | 'reaction'): Promise<Response|Message> => {
    const response: Response = {
        title: 'None',
        description: 'None'
    }
    let promptForTitle = false
    let promptForDescription = false

    if (type === 'command') {
        promptForTitle = panel.command_require_title
        promptForDescription = panel.command_require_description
        if (promptForTitle == false && promptForDescription == false) return response

    }
    if (type === 'reaction') {
        promptForTitle = panel.create_require_title
        promptForDescription = panel.create_require_description
        if (promptForTitle == false && promptForDescription == false) return response
    }

    const sendPromptMethod = (type === 'command') ? (panel.command_dm_prompt == true) ? message.dmprompt : message.prompt : message.dmprompt
    const sendMethod = (type === 'command') ? (panel.command_dm_prompt == true) ? message.dmembed : message.embed : message.dmembed
    
    const cancel = sendMethod({ title: 'Cancelled', description: 'User cancelled / timeout', color: 'failure' })
    if (promptForTitle == true) {
        const titleMessage = new MessageEmbed()
        .setTitle('Give your Ticket a Title')
        .setDescription('What is the main idea of your ticket or what it is about?\n\nRespond **cancel** to cancel')
        .setFooter(`This will time out after 5 minutes. Prompt from ${message.guild?.name} `)
        response.title = await sendPromptMethod(titleMessage)
        if (response.title.toLowerCase() === 'cancel') return cancel
        if (!response.title) return cancel
    }

    if (promptForTitle == true) {
        const titleMessage = new MessageEmbed()
        .setTitle('Give a Brief Description')
        .setDescription('What is the main idea of your ticket or what it is about?\n\nRespond **cancel** to cancel')
        .setFooter(`This will time out after 5 minutes. Prompt from ${message.guild?.name} `)
        response.description = await sendPromptMethod(titleMessage)
        if (response.description.toLowerCase() === 'cancel') return cancel
        if (!response.description) return cancel
    }
    
    return response
}


interface Response {
    title: string,
    description: string,
    [key: string]: string
}
import { Channel, Message, Role, TextChannel } from "discord.js";
import { OriginMessage } from "../extensions/OriginMessage";
import { editStart } from "./prompt";
import parse from './parse'
const CANCEL_MESSAGE = '\n\nRespond **cancel** to cancel.'
const NONE_MESSAGE = '\nRespond **none** to disable.'
/**
 * Get a text channel from the user.
 * @param message Message
 * @param setting Value you are promting for
 * @param value If the user gave a value, if not will prompt for one
 */
export async function askForChannel (message: OriginMessage, setting: string, value?:string): Promise<TextChannel|undefined> {
    if (!message.guild) return;
    if (value) {
        const channel = parse.parseChannel(message.guild, value)
        if (!channel) {
            message.error(`${value} is not a valid text channel.`)
            return;
        }
        else return channel
    }

    const startPrompt = await editStart(message, {
        title: `${setting} Configuration`,
        description: `What would you like to set the ${setting} channel to?${CANCEL_MESSAGE}`
    })

    if (!startPrompt) return
    if (startPrompt.content.toLowerCase() === 'cancel' || !startPrompt) return deletus(startPrompt?.message)

    const channel = parse.parseChannel(message.guild, startPrompt.content)
    if (!channel) {
        message.error(`${startPrompt.content} is not a valid channel.`)
        return;
    }
    else {
        message.success(`Successfully set the ${setting.toLowerCase()} channel to ${channel}`, `${setting} Configured`)
        return channel
    }
}

/**
 * Prompt for a true or false value
 * @param message Message
 * @param setting Setting to prompt for
 * @param value If the user gave a value, if not will prompt for one
 */
export async function askForBoolean (message: OriginMessage, setting: string, value?: string): Promise<boolean|undefined> {
    const requiredResponse: string[] = ['enable', 'disable', 'true', 'false']
    let state = false
    let response: boolean;
    if (value) {
        const argument = value.toLowerCase()
        state = (requiredResponse.includes(argument)) ? true : false
        response = (argument === 'true' || argument == 'false') ? true : false
    }
    else {
        const startPrompt = await editStart(message, {
            title: `${setting} Configuration`,
            description: `Would you like to \`enable\` or \`disable\` ${setting}?${CANCEL_MESSAGE}`,
        })
        if (!startPrompt) return
        const argument: string = startPrompt.content.toLowerCase()

        if (!startPrompt) return
        if (startPrompt.content.toLowerCase() === 'cancel') return deletus(startPrompt.message)

        state = (requiredResponse.includes(argument)) ? true : false
        response = (argument == 'true' ||argument == 'enable') ? true : false
    }
    if (state === false) {
        message.error(`Invalid Response given, valid responses: ${requiredResponse.map(e => `${e}`).join(', ')}`)
    }
    else {
        const enabled_disabled = (response === true) ? 'enabled' : 'disabled'
        message.success(`Successfully ${enabled_disabled} ${setting}`, `${setting} Configured`)
        return response
    }
}

/**
 * Returns the Role as a guild role, undefined if not found or a string if their response was 'none'
 * @param message Message for sending prompt
 * @param setting Setting to ask for the role for
 * @param type Add/Remove a role to an array or set a single one
 * @param value If the user gave a value
 * @param includeNone Include none as an option
 */
export async function askForRole (message: OriginMessage, setting: string, type: 'add' | 'remove' | 'set', value?: string, includeNone = false): Promise<Role|string|undefined> {
    console.log(type)
    const none = (includeNone == true) ? NONE_MESSAGE : ''
    if (!message.guild) return
    if (value) {
        if (value.toLowerCase() == 'none') return 'none'
        const role = parse.parseRole(message.guild, value)
        if (!role) message.error(`Could not find the role ${value}`)
        return role
    }

    const suffix = 
        (type == 'add') ? `add to ${setting.toLowerCase()}`
            : (type == 'remove') ? `remove from ${setting.toLowerCase()}`
                : `set to ${setting.toLowerCase()}`
    const startPrompt = await editStart(message, {
        title: `${setting} Configuration`,
        description: `Give the name, id or mention of the role you wish to ${suffix}.${none}${CANCEL_MESSAGE}`
    })

    if (!startPrompt) return;
    if (startPrompt.content.toLowerCase() == 'cancel') return deletus(startPrompt.message)
    if (includeNone == true && startPrompt.content.toLowerCase() == 'none') {
        message.success(`Successfully set the value of ${setting.toLowerCase()} to none`, `${setting} Configured`)
        return 'none'
    }
    else {
        if (!message.guild) return;
        const role = parse.parseRole(message.guild, startPrompt.content)
        if (!role) {
            message.error(`${startPrompt.content} is not a valid role.`)
            return;
        }
        const endSuffix = 
        (type == 'add') ? `added ${role} to`
            : (type == 'remove') ? `removed ${role} from`
                : `set ${role} to`
        message.success(`Successfully ${endSuffix} ${setting.toLowerCase()}`, `${setting} Configured`)
        return role;
    }


}

async function deletus (message: Message) {
    await message.delete({ timeout: 5000 })
    return undefined;
}
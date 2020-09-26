import { RegularEmbed } from "../../functions/embed";
import OriginMessage from "../extensions/OriginMessage";
import { editStart } from "./prompt";

export default async (message: OriginMessage, setting: string, value?: string): Promise<boolean|undefined> => {
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
                description: `Would you like to \`enable\` or \`disable\` ${setting}?\n\nRespond **cancel** to cancel.`,
            })
            if (!startPrompt) return
            const argument: string = startPrompt.content.toLowerCase()
            if (startPrompt?.content.toLowerCase() === 'cancel' || !startPrompt) {
                startPrompt.message.delete({ timeout: 5000 })
                return;
            }
            state = (requiredResponse.includes(argument)) ? true : false
            response = (argument === 'true' || argument == 'false') ? true : false
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
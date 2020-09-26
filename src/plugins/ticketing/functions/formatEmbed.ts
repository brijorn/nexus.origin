import { Guild, Message, MessageEmbed, User } from "discord.js"

import formats from './formats.json'
import moment from 'moment-timezone'
import { TicketClaimData, TicketCommandCreateData } from "../TicketManager"
import { Panel } from "../../../typings/origin"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (guild: Guild, user: User, panel: Panel, toParse: Record<string, any>, data: TicketCommandCreateData | TicketClaimData): Promise<MessageEmbed> => {

    toParse = toParse.embeds[0]
    for (const [A, B] of Object.entries(toParse)) {
        const key = A
        let value = B as string
        if (key === 'color') continue;
        
            if (typeof value === 'object' && key !== 'fields') {
                for (const [C, D] of Object.entries(value)) {
                    const fieldname = C
                    let fieldvalue = D as string
                    formats.forEach((e: format) => {
                        if (fieldvalue.includes(e.name)) {
                            fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                        }

                    })
                    toParse[key][fieldname] = fieldvalue
                }
            }
            if (key === 'fields') {
                for (let i=0; i < value.length; i++) {
                    const fieldObj = value[i]
                     for (const [D, E] of Object.entries(fieldObj)) {
                         const fieldname = D
                         let fieldvalue = E as string
                         if (typeof fieldvalue !== "boolean") {
                            formats.forEach((e: format) => {
                                if (fieldvalue.includes(e.name)) {
                                    fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                                }
                             })
                             toParse[key][i][fieldname] = fieldvalue
                         }
                     }
                }
            }
            else {
            formats.forEach((e:format) => {
                if (value.includes(e.name)) {
                    value = value.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                    toParse[key] = value
                }
            })
        }
    }
    return toParse as MessageEmbed
}

interface format {
    name: string,
    changeto: string,
    description: string
}
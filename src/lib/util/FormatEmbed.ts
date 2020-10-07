import { GuildMember, MessageEmbed } from "discord.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (JSONDATA: Record<string, any>, member: GuildMember, formats: any[]): Promise<{embed: MessageEmbed, content: string}|undefined> => {
        const toParse = JSONDATA
        for (const [A, B] of Object.entries(toParse)) {
            const key = A
            let value = B as string
            if (key === 'color') continue;
            
                if (typeof value === 'object' && key !== 'fields') {
                    for (const [C, D] of Object.entries(value)) {
                        const fieldname = C
                        let fieldvalue = D as string
                        formats.forEach((e: Record<string, string>) => {
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
                                formats.forEach((e: Record<string, string>) => {
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
                formats.forEach((e: Record<string, string>) => {
                    if (value.includes(e.name)) {
                        value = value.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                        toParse[key] = value
                    }
                })
            }
        }
        const embed = toParse as MessageEmbed
        const content = (toParse.content) ? toParse.content : ''
        return {
            embed,
            content,
        }
}
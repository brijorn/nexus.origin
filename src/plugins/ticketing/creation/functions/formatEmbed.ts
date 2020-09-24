import { Message } from "discord.js"
import { Panel } from "../../../../typings/origin"

const moment = require('moment-timezone')
export default async (data: any, message: Message, panel: Panel, information: any) => {
    const formats = require('./formats.json')

    const user = (information.type === 'claim') ? message.guild!.members.cache.get(information.userId)!.user : message
    data = data.embeds[0]
    for (let [A, B] of Object.entries(data)) {
        let key: any = A
        let value: any = B
        if (key === 'color') continue;
        
            if (typeof value === 'object' && key !== 'fields') {
                for (let [C, D] of Object.entries(value)) {
                    let fieldname: any = C
                    let fieldvalue: any = D
                    formats.forEach((e: any) => {
                        if (fieldvalue.includes(e.name)) {
                            fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                        }

                    })
                    data[key][fieldname] = fieldvalue
                }
            }
            if (key === 'fields') {
                for (let i=0; i < value.length; i++) {
                    let fieldObj = value[i]
                     for (let [D, E] of Object.entries(fieldObj)) {
                         let fieldname: any = D
                         let fieldvalue: any = E
                         if (typeof fieldvalue !== "boolean") {
                            formats.forEach((e: any) => {
                                if (fieldvalue.includes(e.name)) {
                                    fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                                }
                             })
                             data[key][i][fieldname] = fieldvalue
                         }
                     }
                }
            }
            else {
            formats.forEach((e: any) => {
                if (value.includes(e.name)) {
                    value = value.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                    data[key] = value
                }
            })
        }
    }
    return data
}
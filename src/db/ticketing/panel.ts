import { Message } from 'discord.js'
import db from '../'
import { NewPanel } from './types'


export async function createPanel(message: Message, name: string) {
    const panels = await db.withSchema('ticketing').table('ticket_interfaces')
    .where('guild_id', '=', message.guild!.id)
    if (panels.length === 5) return 'max'
    if (panels.find(o => o.interface_name === name)) return 'name'

    const panel = await db.withSchema('ticketing').table('ticket_interfaces')
    .returning("*")
    .insert(new NewPanel(message.guild!.id, 
      JSON.parse(JSON.stringify(opendata)), 
      JSON.parse(JSON.stringify(closedata)), 
      JSON.parse(JSON.stringify(claimdata)))
      )
    .then(data => { return data[0] })
}

/**
 * 
 * @param { Message } message 
 * @param { String } name 
 */
export async function getPanel(message: Message, name: string) {
    const panel = await db.withSchema('ticketing').table('ticket_interfaces')
    .where('guild_id', '=', message.guild!.id)
    .where('interface_name', '=', name)
    .first()
    return panel
}

/**
 * 
 * @param { Message } message 
 * @param { String } name 
 * @param { String } valuenames 
 * @param { Array } values
 */
export async function updatePanel(message: Message, name: string, valuenames: string[], values: string[]) {
  if (valuenames.length !== values.length) return 'Missing Value'
  const info: any = {}
  // Create Object from two Arrays
  for (let i=0; i < valuenames.length; i++) {
    info[valuenames[i]] = values[i]
  }
  await db.withSchema('ticketing').table('ticket_interfaces')
  .where('guild_id', '=', message.guild!.id)
  .where('interface_name', '=', name)
  .update(info)
  return
}


const opendata = {
    "embeds": [
      {
        "title": "Ticket Created",
        "description": "Thank you for filling out a support ticket, staff will be with you shortly. Feel free to describe your reason for opening the ticket while you wait.",
        "color": 7506394,
        "fields": [
          {
            "name": "User",
            "value": "{{user}}",
            "inline": true
          },
          {
            "name": "Creation Date",
            "value": "{{creation.date}}",
            "inline": true
          }
        ]
      }
    ]
  }

const closedata = {
    "embeds": [
      {
        "title": "Ticket Closed",
        "description": "This ticket has been closed by {{user}} and will be deleted after 48 hours. Use the reactions to take further actions.",
        "color": 16747146
      }
    ]
  }


 const claimdata = {
  "embeds": [
    {
      "title": "New Ticket",
      "description": "A new ticket has been created by {{user}}",
      "color": 4706032,
      "fields": [
        {
          "name": "Panel",
          "value": "{{panel.name}}",
          "inline": true
        },
        {
          "name": "Title",
          "value": "{{ticket.title}}",
          "inline": true
        },
        {
          "name": "Description",
          "value": "{{ticket.description}}",
          "inline": true
        }
      ]
    }
  ]
}

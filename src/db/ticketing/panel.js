const { Message } = require('discord.js')
const db = require('../')
const { message } = require('noblox.js')
/**
 * 
 * @param { Message } message 
 * @param { String } name 
 */
exports.createPanel = async function(message, name) {
    const panels = await db.withSchema('ticketing').table('ticket_interfaces')
    .where('guild_id', '=', message.guild.id)
    if (panels.length === 5) return 'max'
    if (panels.find(o => o.interface_name === name)) return 'name'

    const panel = await db.withSchema('ticketing').table('ticket_interfaces')
    .returning("*")
    .insert({
        // Guild
        guild_id: message.guild.id,
        // Interface Information
        interface_name: 'help',
        interface_enabled: true,
        ticket_count: 0,
        // MISC
        is_public: false,
        claim_system: false,
        // CONFIRMATION
        confirm_close: true,
        confirm_delete: true,
        // TICKET MESSAGE
        ticket_name: 'ticket-{{count}}',
        // REACTION MESSAGE
        message_id: 0,
        message_reaction: '📩',
        remove_on_react: true,
        // MESSAGES
        open_message: opendata,
        close_message: closedata,
        // CATEGORY
        open_category: 'Help',
        close_category: 'Closed Help',
        // CREATION SETTINGS
        create_reaction: '📥',
        create_dm_prompt: false,
        create_require_title: true,
        create_require_description: true,
        create_allowed_roles: [message.guild.id],
        create_disallowed_roles: [],
          // COMMAND
        allow_command_create: true,
        command_dm_prompt: true,
        command_require_title: true,
        command_require_description: true,
        // DM NOTIFICATIONS
        open_dm_notify: true,
        close_dm_notify: true,
        // SUPPORT
        support_roles: [],
        // PERMISSIONS
            // OPEN
        user_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        user_open_disallowed_permissions: [],
        support_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        support_open_disallowed_permissions: [],
            // CLOSE
        user_close_permissions: ['VIEW_CHANNEL'],
        user_close_disallowed_permissions:[],
        support_close_permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        support_close_disallowed_permissions: [],
        // TRANSCRIPT
        transcript: true,
        // LOGGING
        log_enabled: true,
        log_channel: 0,
        log_open: true,
        log_close: true,
        log_delete: true,
        log_transcript: true,
        log_transcript_create: true,
        // REACTIONS
        close_reaction: '🔒',
        get_transcript: '📁',
        // CLAIM SYSTEM
        claim_channel: 0,
        claim_reaction: '💻',
        claim_message: claimdata,
        claim_allowed_roles: []
        
    })
    .then(data => { return data[0] })
}

/**
 * 
 * @param { Message } message 
 * @param { String } name 
 */
exports.getPanel = async function(message, name) {
    const panel = await db.withSchema('ticketing').table('ticket_interfaces')
    .where('guild_id', '=', message.guild.id)
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
exports.updatePanel = async function(message, name, valuenames, values) {
  if (valuenames.length !== values.length) return 'Missing Value'
  const info = {}
  // Create Object from two Arrays
  for (i=0; i < valuenames.length; i++) {
    info[valuenames[i]] = values[i]
  }
  await db.withSchema('ticketing').table('ticket_interfaces')
  .where('guild_id', '=', message.guild.id)
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

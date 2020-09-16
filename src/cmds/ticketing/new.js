const panels = require('../../db/ticketing/panel')
const embed = require('../../functions/embed')
const ticketing = require('../../lib/ticketing/main')
module.exports.run = async (bot, message, args, guild) => {
    const name = args.slice(0).join(' ')
    await panels.createPanel(message, 'help')
    const panel = await panels.getPanel(message, name)
    if (!name) return message.channel.send(embed('none', 'Run the command again with the name of the panel you wish to create a ticket for.', guild, '', true, true))
    if (!panel || panel.interface_enabled === false) return message.channel.send(embed(
        'none',
        `The ticket panel ${name} does not exist or is unavailable.`,
        guild, 'default', true, true
    ))

    return await ticketing(bot, message, guild, 'command', panel)
}

module.exports.help = {
    name: 'new',
    description: 'Creates a new ticket for the given panel',
    module: 'ticketing',
    syntax: ['!new support']
}
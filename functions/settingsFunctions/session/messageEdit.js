const embed = require('../../embed')
const delprompt = require('../../../prompt/delprompt')
const config = require('../../../config.json')

module.exports = async (messageMenu, message, guild) => {
    let closed = false
    let validOptions = ['type one', 'prompt one', 'enabled one', 'type two', 'prompt two', 'enabled two', 'type three', 'prompt three', 'enabled three']
    const filter = (response) => response.author.id === message.author.id;
    while (!closed === true) {
        await message.channel.awaitMessages(filter, { max: 1, time: 180000,})
        .then(async collected => {
            if (collected.first() === undefined) return
            const msg = collected.first().content
            const content = msg.toLowerCase()
            if (content.startsWith('type')) {
                collected.first().delete()
                let field = 0
                if (content.includes('one')) field = 2
                if (content.includes('two')) field = 5
                if (content.includes('three')) field = 8
                if (field === 0) return message.channel.send('Please give a valid number.')
                const infoprompt = embed('none', 'What would you like to set the type to?\n Valid Types: `yesno`, `content`', guild)
                const information = await delprompt(message, infoprompt, 5, 5)
                const infolower = information.toLowerCase()
                if (infolower !== 'yesno' && infolower !== 'content') return message.channel.send(embed('none', 'Invalid Type given', guild))
                if (infolower === 'yesno') {
                    const infoprompt2 = embed('none', 'What is the behaviour for these responses?Syntax: <yes-behaviour>:<no-behaviour>\nPlaceholders: `{{cancel}}`\n Note: set the behaviour to {{continue}} to continue the prompt.\n Example {{continue}}:{{cancel}}', guild)
                    const information2 = await delprompt(message, infoprompt2, 5, 5)
                    if (information2.includes(':') === false) return message.channel.send(embed('none', 'Error with behaviours, be sure to follow the syntax.', guild))
                    const newEmbed = messageMenu.embeds[0]
                    newEmbed.fields[field].value = information + ',' + information2
                    messageMenu.edit(newEmbed)                
                }
                else {
                    const newEmbed = messageMenu.embeds[0]
                newEmbed.fields[field].value = information
                messageMenu.edit(newEmbed)
                }
            }
            if (content.startsWith('prompt')) {
                collected.first().delete()
                let field = -1
                if (content.includes('one')) field = 1
                if (content.includes('two')) field = 4
                if (content.includes('three')) field = 7
                if (field === -1) return message.channel.send('Please give a valid number.')
                const infoprompt = embed('none', 'What would you like to set the prompt question to?', guild)
                const information = await delprompt(message, infoprompt, 5, 5)
                const newEmbed = messageMenu.embeds[0]
                newEmbed.fields[field].value = information
                messageMenu.edit(newEmbed)

            }
            if (content.startsWith('enabled')) {
                collected.first().delete()
                let field = -1
                if (content.includes('one')) field = 0
                if (content.includes('two')) field = 3
                if (content.includes('three')) field = 6
                if (field === -1) return message.channel.send('Please give a valid number.')
                const infoprompt = embed('none', 'What would you like to set the enabled value to?\nOptions: `true`, `false`', guild)
                const information = await delprompt(message, infoprompt, 5, 5)
                const infolower = information.toLowerCase()
                if (infolower !== 'true' && infolower !== 'true') return message.channel.send(embed('none', 'Invalid Type given', guild))
                const newEmbed = messageMenu.embeds[0]
                newEmbed.fields[field].value = information
                messageMenu.edit(newEmbed)
            }
            if (content === 'close') {
                collected.first().delete()
                closed = true
            }
        })
    }
    return messageMenu
}
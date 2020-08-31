const embed = require('../../functions/embed')
const editStartPrompt = require('../../prompt/editStartPrompt')
const { MessageEmbed } = require('discord.js')
const editprompt = require('../../prompt/editprompt')
module.exports = async (bot, message, args, guild) => {
    const argL = args.map(arg => arg.toLowerCase())
    const embedInfo = guild.embedInfo
    if (!argL[1]) {
        const embedInformation = new MessageEmbed()
        .setTitle('Embed Info')
        .setDescription('Updates the specified fields for eligible embeds.')
        .addField('Color', embedInfo.color + `\n \`Configured with ${guild.prefix}embed color <#color>\``, true)
        .addField('Footer', embedInfo.footer + `\n \`Configured with ${guild.prefix}embed footerlogo <img-link>\``, true)
        .addField('Footer Logo', `[Link](${embedInfo.footerlogo})` + `\n \`Configured with ${guild.prefix}embed footerlogo <img-link>\``, true)
        .setColor(embedInfo.color)
        .setFooter(embedInfo.footer, embedInfo.footerlogo)
        message.channel.send(embedInformation)
    }
    if (argL[1] === 'color') {
        if (!args[2]) {
            const ask = await editStartPrompt(message, embed('Embed Color', 'What would you like to set the color to?\nPlease give a hex code, example: `#fffff`', guild))
        if (!ask.content.startsWith('#')) return ask.message.edit(embed('none', 'Invalid Hex Code', guild))
        guild.embedInfo.color = ask.content
        guild.markModified('embedInfo')
        await guild.save()
        ask.message.edit(embed('none', 'The embed color has successfully been changed', guild))
        }
        if (args[2]) {
            if (!args[2].startsWith('#')) return message.channel.send(embed('none', 'Invalid Hex Code', guild))
            guild.embedInfo.color = args[2]
            guild.markModified('embedInfo')
            await guild.save()
            message.channel.send(embed('none', 'The embed color has successfully been changed', guild))
        }
    }
    if (argL[1] === 'footerlogo' || argL[1] === 'footer' && argL[2] === 'logo') {
        if (argL[1] === 'footer' && argL[2] === 'logo' && !argL[3]) {
            const startmsg = embed('Embed Footer Logo', 'What would you like to set the footer logo to?\nPlease provide a link to the image such as https://i.imgur.com/s8Fxate.png\n\nRespond **cancel** to cancel', guild)
            const start = await editStartPrompt(message, startmsg)
            if (start.content.toLowerCase() === 'cancel') {
                start.message.delete({ timeout: 1 })
                message.chanenl.send('Cancelled.')
            }
            guild.embedInfo.footerlogo = start.content
            guild.markModified('embedInfo')
            await guild.save()
            start.message.edit(embed('none', `The footer logo has successfully changed to de [Link](${start.content})`, guild))    
        }
        if (argL[1] === 'footer' && argL[2] === 'logo' && argL[3]) {
            guild.embedInfo.footerlogo = argL[3]
            guild.markModified('embedInfo')
            await guild.save()
            message.channel.send(embed('none', `The footer logo has successfully changed to [Link](${argL[3]})`, guild))
        }
        if (argL[1] === 'footerlogo') {
            if (!argL[2]) {
                const startmsg = embed('Embed Footer Logo', 'What would you like to set the footer logo to?\nPlease provide a link to the image such as https://i.imgur.com/s8Fxate.png\n\nRespond **cancel** to cancel', guild)
                const start = await editStartPrompt(message, startmsg)
                if (start.content.toLowerCase() === 'cancel') {
                    start.message.delete({ timeout: 1 })
                    message.chanenl.send('Cancelled.')
                }
                guild.embedInfo.footerlogo = start.content
                guild.markModified('embedInfo')
                await guild.save()
                start.message.edit(embed('none', `The footer logo has successfully changed to  a[Link](${start.content})`, guild))
    
            }
            if (argL[2]) {
                const msg = embed('none', `The footer logo has successfully changed to [Link](${argL[2]})`, guild)
                message.channel.send(msg)

                guild.embedInfo.footerlogo = argL[2]
                guild.markModified('embedInfo')
                await guild.save()
            }
        }
    }
}
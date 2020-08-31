const config = require('../../config.json')
const embed = require('../../functions/embed')
const substring = require('../../functions/substring');
module.exports = async (bot, message, args, guild, type, directory, setting, name, method='string') => {
    const numbers = new RegExp("^[0-9]+$");
    args = args.slice(2).join(' ')
    const dir = type[directory]
    async function Save(newvalue) {
        if (method === 'string') dir[setting] = newvalue 
        else dir[setting].push(newvalue)
        guild.markModified(directory)
        await guild.save()
    }
    if (args[2]) {
        if (isNaN((args[2]) === false)) {
            if (!message.guild.roles.cache.get(args[2])) return message.channel.send(embed('none', 'Could not find the role ' + args[2], config.failure))
        await Save(args[2])
            return message.channel.send(embed('none', `Successfully set the ${name} role to ` + `\`${message.guild.roles.cache.get(finishedrole).name}\``, guild, config.success))
        }
        if (args[2].startsWith('<@&') && args[2].endsWith('>')) {
        const finishedrole = await substring(args[2], 'role')
        await Save(finishedrole)
        return message.channel.send(embed('none', `Successfully set the ${name} role to ` + `\`${message.guild.roles.cache.get(finishedrole).name}\``, guild, config.success))

        }
        if (numbers.test(args[2]) === false) {
            if (message.guild.roles.cache.find(therole => therole.name.toLowerCase() === args[2].toLowerCase())) {
                foundrole = message.guild.roles.cache.find(therole => therole.name.toLowerCase() === args[2].toLowerCase())
                await Save(foundrole)
            return message.channel.send(embed('none', `Successfully set the ${name} role to ` + `\`${foundrole.name}\``, guild, config.success))

            }
            else {
                await message.guild.roles.create({
                
                    data: {
                      name: args[2],
                    },
                    reason: 'Creating',
                  }).then(async createdrole => {
                    await Save(createdrole.id)
                    return message.channel.send(embed('none', `Successfully created and bound the ${name} role to ` + `\`${createdrole.name}\``, guild, config.success))
                  })
            }
        }
    }
    else {
        const editStart = require('../../prompt/editStartPrompt')
        const startmsg = embed(name + ' Setup', `What would you like to set the ${name} to?\nPlease Provide one of these: \`mention-role, role-name, role-id\`\nNote: If I can\'t find the \`role-name\` given, I will create one.\n\nSay **cancel** to cancel`, guild)
        const start = await editStart(message, startmsg)
        if (start.content === 'cancel') return start.message.edit(embed('none', 'Cancelled', guild, config.failure))
        if (numbers.test(start.content) === true) {
            if (!message.guild.roles.cache.get(start.content)) return message.channel.send(embed('none', 'Could not find the role ' + start.content, config.failure))
    
            await Save(start.content)
            return start.message.edit(embed('none', `Successfully created and bound the ${name} role to ` + `\`${start.content}\``, guild, config.success))
        }
        if (start.content.startsWith('<@&') && start.content.endsWith('>')) {
        const channelb = start.content.substring(3);
        const finishedrole = channelb.substring(0, channelb.length - 1);
        await Save(finishedrole)
            return start.message.edit(embed('none', `Successfully created and bound the ${name} role to ` + `\`${createdrole.name}\``, guild, config.success))
        }
        if (numbers.test(start.content) === false) {
            if (message.guild.roles.cache.find(therole => therole.name === start.content)) {
                foundrole = message.guild.roles.cache.find(therole => therole.name === start.content)
                await Save(foundrole.id)
            return start.message.edit(embed('none', `Successfully created and bound the ${name} role to ` + `\`${foundrole.name}\``, guild, config.success))
            }
            else {
               const createdrole = await message.guild.roles.create({
                data: {
                  name: start.content,
                },
                reason: `${name} Role Creation`,
              })
                  await Save(createdrole.id)
                  return start.message.edit(embed('none', `Successfully created and bound the ${name} role to ` + `\`${createdrole.name}\``, guild, config.success))
            }
        }
        

    }
}
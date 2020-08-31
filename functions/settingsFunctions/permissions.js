const { MessageEmbed } = require('discord.js')
const embed = require('../embed')

module.exports = async (bot, message, args, guild) => {
    validOptions = ['owner', 'admin']
    const perms = guild.permissions
    if (!args[1]) {
        const owners = perms.owners.map(each => `<@${each}> - ${message.guild.members.cache.get(each).user.username}#${message.guild.members.cache.get(each).user.discriminator}`)
        const owner = (perms.owners.length <= 0) ? 'none' : owners
        const admins = perms.admins.map(each => `<@${each}> - ${message.guild.members.cache.get(each).user.username}#${message.guild.members.cache.get(each).user.discriminator}`)
        const admin = (perms.admins.length <= 0) ? 'none' : admins
        const perminfo = new MessageEmbed()
            .setTitle('Permissions Menu')
            .setDescription(`Permissions can be added with the following:\n\`${guild.prefix}settings permissions <owner, admin> <add, remove> <user-id, mention>\``)
            .addField('Owners', owner)
            .addField('Admins', admin)
            return message.channel.send(perminfo)
    }
    if (!args[1] || !args[2]) return message.channel.send(embed('none', 'Missing Arguments.', guild))
    const type = args[1].toLowerCase()
    const action = args[2].toLowerCase()
        const validActions = ['add', 'remove']
        const validTypes = ['owner', 'admin']
        if (validActions.includes(action) === false) return message.channel.send(embed('none', 'Please give a valid action.', guild))
        if (validTypes.includes(type) === false) return message.channel.send(embed('none', 'Please give a valid type.', guild))
        if (!args[3]) return message.channel.send(embed('none', 'Please mention or give a user id to add to the owner permission.'))
        if (type === 'owner' && message.author.id !== message.guild.owner.id) return message.channel.send(embed('none', 'You do not have permission to add owners.\n\nRequired: `Owner`.', guild))
        if (type === 'admin' && message.author.id !== message.guild.owner.id && !perms.owners.includes(message.author.id)) return message.channel.send(embed('none', 'You do not have permission to add Admins.\n\nRequired: `Owner`.', guild))
        let user = args[3]
        if (user.startsWith('<@') && user.endsWith('>')) {
            const channelb = user.substring(3);
            const finishedchannel = channelb.substring(0, channelb.length - 1);
            user = finishedchannel
        }
        else {
            if (isNaN(user)) return message.channel.send(embed('none', 'Please mention a user or give a user ID.', guild))
            user = args[3]
        }
        if (action === 'add') {
            if (type === 'owner') {
                if (perms.owners.includes(user)) return message.channel.send(embed('none', 'The user already has the specified perm', guild))
                guild.permissions['owners'].push(user)
                guild.markModified('permissions')
                await guild.save(function(err) {
                    if (err) {console.log('error')}
                });
                return message.channel.send(embed('none', `Successfully added ${args[3]} to the \`owners\` permission list.`, guild))
            }
            if (type === 'admin') {
                if (perms.owners.includes(user)) return message.channel.send(embed('none', 'The user already has the specified perm', guild))
                guild.permissions['admins'].push(user)
                guild.markModified('permissions')
                await guild.save(function(err) {
                    if (err) {console.log('error')}
                });
                return message.channel.send(embed('none', `Successfully added ${args[3]} to the \`admins\` permission list.`, guild))
            }
        }
        if (action === 'remove') {
            if (type === 'admin') {
                if (!perms.admins.includes(user)) return message.channel.send(embed('none', 'that user is not an admin.', guild))
                const element = perms.admins.find(ele => ele === user)
                const index = perms.admins.indexOf(element)
                perms.admins.splice(index, 1)
                guild.markModified('permissions')
                await guild.save(function(err) {
                    if (err) {console.log('error')}
                    return message.channel.send(embed('none', `Successfully removed ${args[3]} to the \`admins\` permission list.`, guild))
                });
            }
            if (type === 'owner') {
                if (!perms.owners.includes(user)) return message.channel.send(embed('none', 'that user is not an admin.', guild))
                const element = perms.owners.find(ele => ele === user)
                const index = perms.admins.indexOf(element)
                perms.owners.splice(index, 1)
                guild.markModified('permissions')
                await guild.save(function(err) {
                    if (err) {console.log('error')}
                    return message.channel.send(embed('none', `Successfully removed ${args[3]} to the \`owners\` permission list.`, guild))
                });
            }
        }

}
const embed = require("../../functions/embed")

exports.removeAsset = async function(message, guild, option, type, id) {
    console.log('here')
    const obj = guild.assetBinds.find(a => a.assetId === id)
    let array = guild.assetBinds
    if (option === 'gamepass') array = guild.gamepassBinds
    if (option === 'rank') array = guild.rankBinds
    if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false))
    const index = guild.assetBinds.indexOf(obj)
    array.splice(index, 1)
    guild.markModified(array)
    await guild.save()
    return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false))
}

exports.removeGroup = async function(message, guild, option, type, id) {
    const obj = guild.roleBinds.find(a => a.id === id)
    if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false))
    const index = guild.roleBinds.indexOf(obj)
    guild.roleBinds.splice(index, 1)
    guild.markModified(array)
    await guild.save()
    return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false))
}
module.exports = async (bot, message, value) => {
    let pre = value
    let found = false
    let channel = undefined
    if (pre.startsWith('<#') && pre.endsWith('>')) {
        pre = pre.substring(2)
        pre = pre.substring(0, pre.length - 1)
        if (message.guild.channels.cache.get(pre)) {
            pre = message.guild.channels.cache.get(pre).id
            found = true
        }
        else return
    }
    if (isNaN(pre) === false && found === false) {
        if (message.guild.channels.cache.get(pre)) return { channel: pre = message.guild.channels.cache.get(pre).id, found: true}
        else return
    }
    if (found === false) {
        if (message.guild.channels.cache.find(c => c.name === pre)) {
            pre = message.guild.channels.cache.find(c => c.name.toLowerCase() === pre.toLowerCase()).id
            found = true
        }
    }
    return {
        found,
        pre,
    }
}
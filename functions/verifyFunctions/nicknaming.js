const formats = require('../../formats.json')

module.exports = async (message, guild, newUsername, roleInfo, type='Def') => {
    let format = guild.verificationSettings.nicknameFormat

    formats.nicknameformats.forEach(each => {
        if (format.includes(each.name)) {
            format = format.replace(each.name, eval(each.changeto))
        }
    })
    const which = (type === 'Def') ? message.member : message
    which.setNickname(format)
    .catch((err) => {return})
    return format
}
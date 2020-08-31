const rbx = require('noblox.js')
const config = require('../../config.json')
const fetch = require('node-fetch')
const getGame = require('../../rbapi/getGameUniverse')
const getGameUniverse = require('../../rbapi/getGameUniverse')
module.exports = async (user) => {
    // Emojis
    const online = '<:online:748208168902852731>'
    const ingame = '<:playing:748208152448598016>'
    const develop = '<:developing:748208161550499931>'
    const offline = '<:offline:741320452755947621>'

    // Get the presence
    const getPresence = require('../../rbapi/getPresence')
    await rbx.setCookie(config.robloxtoken)

    // Get the first presence given
    let info = await rbx.getPresences({userIds: [user]})
    info = info.userPresences[0]

    // Convert the presences to strings based on what they are
    let string = undefined
    if (info.userPresenceType === 0) {
        function Last(time) {
            const parsed = Date.parse(time)
            let thetime = ''
            const minutes = new Date(parsed * 1000).getUTCHours * 60
            thetime = minutes
            if (thetime > 60) {
                time = new Date(parsed * 1000).getUTCHours()
                if (thetime > 24) {
                    thetime = new Date(parsed * 1000).toLocaleString()
                }
                else {
                    thetime = thetime.toLocaleString() + ' Hours Ago(UTC)'
                }
                return thetime
            }
            else {
                console.log(thetime)
                if (thetime < 10) return thetime = 'Just Now'
                else {
                    return thetime + ' Minutes Ago(UTC)'
                }
            }
            
        }
        string = `${offline} Last Online ${Last(info.lastOnline)}`
    }
    if (info.userPresenceType === 1) {
        string = `${online} Website`
    }
    if (info.userPresenceType === 2) {
        if (info.universeId === null) {
            string = `${ingame} Playing a Game`
        }
        if (info.universeId !== null) {
            string = `${ingame} Playing [${info.lastLocation}](https://www.roblox.com/games/${info.placeId})`
        }
    }

    return string
}
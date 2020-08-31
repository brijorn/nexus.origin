const rbx = require('noblox.js')
const fetch = require('node-fetch')
const thumbnail = require('./thumbnailFunction')
const { user } = require('..')
module.exports = async (id, type = 'user') => {
    if (type === 'primary') {
        let val = ''
        const primaryGroup = await fetch(`https://groups.roblox.com/v1/users/${id}/groups/primary/role`).then(response => response.json())
        .then(data => {
            const body = data.group
            const role = data.role
            if (body === undefined) return val = undefined
            val = `[${body.name} - ${role.name}](https://roblox.com/groups/${body.id})`
            return val
        })
        .catch(err => console.log(err))
        const state = (val === undefined) ? 'None' : val
        return state
    }
    if (type === 'user') {
        const friendData = await rbx.getFriends(id)
        const friends = friendData.data.length
        const followers = await fetch(`https://friends.roblox.com/v1/users/${id}/followers/count`).then(response => response.json())
        .then(data => {
            return data.count
        })
        const following = await fetch(`https://friends.roblox.com/v1/users/${id}/followings/count`).then(response => response.json())
        .then(data => {
            return data.count
        })
        const blurb = await rbx.getBlurb(id)
        const status = await rbx.getStatus(id)
        const GroupData = await rbx.getGroups(id)
        const groups = GroupData.length
        return {
            friends,
            followers,
            following,
            blurb,
            groups,
            status,
        }
    }
    else if (type === 'group') {
        const groupFetch = await fetch(`https://groups.roblox.com/v1/groups/${id}`).then(response => response.json())
            .then(data => {
                return data
            })
            return {
                groupFetch,
            }
    }
    else if (type === 'game') {
        const gameFetch = await fetch(`https://games.roblox.com/v1/games/list?model.keyword=${id}&model.maxRows=1`).then(response => response.json())
        .then(data => {
            const finished = data.games[0]
            return finished
        })
        const universe = await fetch(`https://games.roblox.com/v1/games?universeIds=${gameFetch.universeId}`).then(response => response.json())
        .then(data => {
            const finished = data.data[0]
            return finished
        })
        return {
            gameFetch,
            universe,
        }
    }

}
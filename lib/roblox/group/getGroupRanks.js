const fetch = require('node-fetch')

module.exports = async (thegroup, userID, type) => {
    const group = parseInt(thegroup, 10)
    if (type !== 'name') {
        const search = await fetch(`https://groups.roblox.com/v2/users/${userID}/groups/roles`).then(response => response.json)
        .then(body => {
            return body
        })
        if (!search.data.find(item => item.group.id === group)) throw new Error('User not In specified group.')
        else {
            const rank = search.data.find(item => item.group.id === group).role.rank
            const roleID = search.data.find(item => item.group.id === group).role.id
            return {
                rank,
                roleID
            }
        }
    }
    if (type === 'name') {
        const search = await fetch(`https://groups.roblox.com/v2/users/${userID}/groups/roles`).then(response => response.json())
        .then(body => {
            return body.data
        })
        if (!search.find(item => item.group.id === group)) throw new Error('User not In specified group.')
        else {
            const rankname = search.find(item => item.group.id === group).role.name
            const roleID = search.find(item => item.group.id === group).role.id
            return {
                rankname,
                roleID
            }
    }
}}
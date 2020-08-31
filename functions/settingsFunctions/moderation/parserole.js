module.exports = async (message, i, roles,  ele, newroles, notfound, createdRoles) => {
    let roleid = ''
    let status = ''
    if (isNaN(ele) === true) {
        if (ele.includes('<@')) {
            let e =  ele.substring(3)
            e = e.substring(0, e.length - 1)
            if (!await message.guild.roles.cache.get(e))  {
                roleid = e,
                status = 'notfound'
            }
            else {
                roleid = e,
                status = 'found'
            }
        }
        else {
            if (message.guild.roles.cache.find(arole => arole.name === roles[i])) {
                const arole = message.guild.roles.cache.find(arole => arole.name === roles[i])
                    roleid = arole.id,
                    status = 'found'
            }
            else {
                const newrole = await message.guild.roles.create({
                    data: {
                        name: roles[i]
                    },
                    reason: 'Nexus Moderation Role Creation'
                })
                    roleid = newrole.id,
                    status = 'created'
            }
        }
    }
    else {
        if (!await message.guild.roles.cache.get(ele)) notfound.push('here:', roles.indexOf(ele) + ele)
        else {
                roleid = ele,
                status = 'found'
        }
    }
    return {
        roleid,
        status,
    }
}
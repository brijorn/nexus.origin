module.exports = async (message, rolename) => {
    if (message.guild.roles.cache.has(rolename)) {
        const roleid = message.guild.roles.cache.get(rolename).id
        return roleid
    }
    else {
        const role = message.guild.roles.create({
            data: {
                name: rolename
            },
            reason: 'Role Binding',
        }).then(role => {
            const roleid = role.id
            return roleid
        })
        return role
    }
}
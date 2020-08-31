const bind = require('../../lib/bind/index')
const embed = require('../../functions/embed')
module.exports.run = async (bot, message, args, guild) => {
    if (!args[0] || !args[1] ||  !args[2]) return message.channel.send(embed('none', `Missing Arguments, run ${guild.prefix}help bind for help with this command`, guild, 'failure', false))
    let option = args[0].toLowerCase()
    let type = args[1].toLowerCase()
    if (option === 'asset' || option === 'gamepass' || option === 'rank') {
        let id = args[2].toLowerCase()

        console.log(args)
        let types = ['add', 'remove', 'edit', 'create']
        if (!types.includes(type)) return message.channel.send('none', 'Invalid Option Given, Options: `add, remove, edit`', guild, 'failure', false)
        
        if (type === 'add') {
            let roleId = args[3]
            if (!args.find(o => o.startsWith('\'')) || !args.find(o => o.endsWith('\''))) return message.channel.send(embed('none', 'Missing nickname, make sure it is inside quotations.\nExample: `\'[VIP]{robloxname}\'`' + `\nFor more information run \`${guild.prefix}help binds\``, guild, 'failure', false))
            // Find argument with quotes, get the index then split
            const quotestart = args.find(o => o.startsWith('\'')); const quoteEnd = args.find(o => o.endsWith('\''));
            const startIndex = args.indexOf(quotestart); const endIndex = args.indexOf(quoteEnd);
            let nickname = args.splice(startIndex, endIndex - 2).join('')
            nickname = nickname.replace('{{s}}', ' ')
            const hierarchy = args[3]
            // Get the roles then create a new array with them
            let roles = args.splice(4).join('')
            roles = roles.split(','); roles = roles.filter(v=>v!='');roles = roles.map(p => p.trim())
            await bind.addAsset(message, guild, option, type, id, nickname, hierarchy, roles)
        }
        
        if (type === 'remove') await bind.removeAsset(message, guild, option, type, id)
    }
    if (option === 'group') {
        if (type === 'add') {
            // Group Id
            let id = args[2].toLowerCase()
            // Ranks to Bind
            let ranks = args[3]
            ranks = ranks.split(',')
            if (typeof ranks === String) ranks = [ranks]
            console.log(ranks)
            // Nickname
            const quotestart = args.find(o => o.startsWith('\'')); const quoteEnd = args.find(o => o.endsWith('\''));
            const startIndex = args.indexOf(quotestart); const endIndex = args.indexOf(quoteEnd);
            let nickname = args.splice(startIndex, endIndex - 3).join('')
            nickname = nickname.replace('{{s}}', ' ')

            // Hierarchy Point
            const hierarchy = args[4]
            let roles = args.splice(5).join('')
            roles = roles.split(','); roles = roles.filter(v=>v!='');roles = roles.map(p => p.trim())
            console.log(roles)
            console.log(roles[0])
            console.log(message.guild.roles.cache.get(roles[0]))
            await bind.addGroup(message, guild, type, option, id, ranks, nickname, hierarchy, roles)
        }
    }
}

module.exports.help = {
    name: 'bind',
    description: 'Add, remove or edit a group, asset, gamepass or badge bind',
    aliases: ['binds'],
    syntax: [
        '!bind group create `5845349 1-50`',
        '!bind group add 5845349, 100-200 [Staff]{{s}}{robloxname} 5 Staff', 
        '!bind asset add <asset-id> <role-id>',
        '!bind gamepass remove <asset-id> or <rank-id> with groups',
        '!bind group remove all',
    ],
    inDepth: 'Use this command to add, remove or edit bindings to a group, asset gamepass or badge.' +
    '\nWhen using group the following are available:\n\n`bind group add 5845349 1-255 create` to create bindings for all the ranks in the given group.' +
    'This will skip those that already exist. You can also create custom settings using the nicknameformat placeholders.\nSyntax: `bind group add [groupid: 5845349] [rank: 100] [nickname: \'[STAFF]{{s}}{robloxname}\'] [hierarchy: the higher the number the more important] [role, roles]`\n Example: `bind group add 100 \'[Owner]{roblox-name}\' 1 749748861651779695,740596178177097880`\n Other Methods: `bind group clear [groupid]` - clear all group binds' +
    '\n\nWhen using any other type of bind the syntax is fairly the same:\n\n' +
    'Syntax: `bind [asset-type] add [assetId] [nickname] [hiearchy] [role, roles]`' +
    '\nExample: `bind asset add 3196348 \'[Adopt Me Vip]{robloxname}\' 1 738249753581846538`' +
    '\n\n**Use quotations for nickname for both group and asset nicknames if they are more than one character. To use the default nickname put `default` for the nickname value**\nTo include a space in the nickname use `{{s}}`',
    module: 'settings',

}
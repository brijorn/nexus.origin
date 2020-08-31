const { enabled, disabled } = require('../../config.json')
module.exports = async (bot, message, args, guild) => {
    // GLOBAL 
    const prefix = guild.prefix
    const embedInfo = guild.embedInfo
    //Disabled Object
    const disabledMod = (guild.disabledModules.length > 0) ? guild.disabledModules : 'None'
    const disabledCOM = (guild.disabledCommands.length > 0) ? guild.disabledCommands : 'None'
    const disabledObj = {
        disabledCommands: disabledMod,
        disabledModules: disabledCOM,
    }

    // Roblox Binding Object
    console.log(guild.gamepassBinds)
    const robloxGroup = (!guild.robloxGroup) ? 'No linked Group' : 'Linked Group: ' + guild.robloxGroup
    const assetBindings = (guild.assetBinds.length > 0) ? guild.assetBinds.map(obj => `${obj.name} : ${obj.assetID} : <@&${obj.roleID}>`) : 'None'
    const gamepassBindings = (guild.gamepassBinds.length > 0) ? guild.gamepassBinds.map(obj => `${obj.name} : ${obj.assetID} : <@&${obj.roleID}>`) : 'None'
    const rankBindings = (guild.rankBinds.length > 0) ? guild.rankBinds.map(obj => `${obj.name} : ${obj.assetID} : ${obj.rank}`) : 'None'
    const tokenStatus = (!guild.robloxToken || guild.robloxToken === '') ? `${disabled} None` : `${enabled} Given`
    const roblox = {
        group: robloxGroup,
        assetBnd: assetBindings,
        gameBnd: gamepassBindings,
        rankBnd: rankBindings,
        token: tokenStatus,
    }
    // Suggestions and Application Information
        const suggestionInfo = guild.suggestionInfo
        const sgststatus = (suggestionInfo && suggestionInfo.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
        const sgstchannel = (suggestionInfo && suggestionInfo.channel) ? `\nChannel: <#${suggestionInfo.channel}>` : ''
        const sugCool = (suggestionInfo && suggestionInfo.enabled && suggestionInfo.enabled === true) ? `\nCooldown: \`${suggestionInfo.cooldown / 1000} seconds\`` : ''
        sgstInfo = {
            status: sgststatus,
            channel: sgststatus,
            cooldown: sugCool
    }
    const points = guild.points
    const pntstatus = (points && points.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
    const pntInfo = {
        status: pntstatus
    }
    const app = guild.applications
    const appstatus = (app && app.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
    const appInfo = {
        status: appstatus
    }

    // Moderation Object
    const mod = guild.moderation
    const modstatus = (mod && mod.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
    const modrole = (mod && mod.modrole) ? mod.modrole.map(c => `${c} - ${message.guild.roles.cache.get(c)}`).join(', ') : 'None'
    const modlog = (mod && mod.modlog) ? `${mod.modlog} - <#${mod.modlog}>`: 'none'
    const mutedrole = (mod && mod.mutedrole) ? `${mod.mutedrole} - <@&${mod.mutedrole}>` : 'none'
    const cases = (mod) ? mod.cases : '0'
    const modInfo = {
        status: modstatus,
        modrole: modrole,
        mutedrole: mutedrole,
        cases: cases,
        modlog: modlog
    }

        // Logging Object
        const log = guild.logging
        const logstatus = (log && log.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`
        const avArray = ['moderation', 'ranking']
        const enabledSetting = (log && log.settings.length > 0) ? log.settings.map(each => { if (each.status === true) return `${each.name}` }) : 'None'
        const available = avArray.filter(a => !enabledSetting.includes(a));
        const avList = available.map(e => `${e}`).join(', ')
        const logInfo = {
            status: logstatus,
            enabledSettings: enabledSetting,
            available: avList
        }


    
    
    
    return {
        disabledObj,
        roblox,
        sgstInfo,
        pntInfo,
        appInfo,
        modInfo,
        logInfo,

    }
}
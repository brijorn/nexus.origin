import { Message, MessageEmbed } from "discord.js";
import { ApplicationSettings, GuildSettings, OriginClient, OriginMessage } from "../../typings/origin";
import AddApplication from "./AddApplication";
import { CreateApplicationSettings } from "./office";

export default async (bot: OriginClient, message: OriginMessage, args: string[], guild: GuildSettings): Promise<void> => {
    console.log(args)
    if (!message.guild) return;

    let application: ApplicationSettings = await bot.handlers.database.getOne('modules', 'application', { guild_id: message.guild.id })

    if (!application) {
        application = await CreateApplicationSettings(bot.handlers.database, message.guild.id)
    }

    if (!args[1]) {
        const applicationSettingsEmbed = new MessageEmbed()
        .setTitle('Moderation Settings')
		.setDescription(
			`To configure a value use ${guild.prefix}settings application <setting> or ${guild.prefix}settings application <setting> [value]`,
        )
        .addFields(
            { name: 'Enabled', value: application.enabled, inline: true},
            { name: 'ReviewerRoles', value: (application.reviewer_roles.length > 0) ? application.reviewer_roles.map(role => `<@&${role}>`).join(', ') : 'None', inline: true},
            { name: 'Applications', value: application.applications.length || '0', inline: true}
        )

        message.channel.send(applicationSettingsEmbed)
        return;
    }

    const argument = args[1].toLowerCase()

    if (argument == 'toggle') {
        const switcheroo = (application.enabled == true) ? false : true

        application.enabled = switcheroo

        const switchwitch = (switcheroo == true) ? 'enabled' : 'disabled'

        message.success(`Sucessfully ${switchwitch} applications`)

        return await save(bot, application)
    }

    if (argument == 'add' || argument == 'create') {
        const createdApplication = await AddApplication(bot, message, application, guild)
        if (!createdApplication) return;
        application.applications.push(createdApplication)
        return await save(bot, application)
    }

    if (argument == 'remove') {
        console.log(application)
        let name = args.slice(2).join(' ');
        if (!name) {
            const promptForName = await message.prompt('What is the name of the application?')

            if (!promptForName) {
                message.send('Cancelled.')
                return;
            }

            name = promptForName
        }

        const findApplication = application.applications.find(app => app.name.toLowerCase().includes(name.toLowerCase()))
        if (!findApplication) {
            message.send('Could not find an application with the name: ' + name)
            return;
        }

        const confirmRemove = await message.prompt('Are you sure you want to delete this application?', undefined, undefined, true)
        if (!confirmRemove) return;

        if (confirmRemove.startsWith('n')) {
            message.send('Cancelled')
            return;
        }

        const index = application.applications.indexOf(findApplication)
        application.applications.splice(index)
        message.success(`Sucessfully deleted the application ${findApplication.name}`)

        return await save(bot, application)
    }
}

async function save(bot: OriginClient, application: ApplicationSettings) {
    return await bot.handlers.database.save('modules', 'application', { guild_id: application.guild_id }, application)
}
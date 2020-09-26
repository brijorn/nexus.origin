import { Guild, OverwriteResolvable, Permissions, User } from "discord.js";
import { TicketCommandCreateData, TicketClaimData } from '../TicketManager'
import { Panel } from "../../../typings/origin.d";

export default (guild: Guild, panel: Panel, user: User, type: 'creation' | 'claim' , data: TicketCommandCreateData | TicketClaimData): OverwriteResolvable[] => {
    const arrayOfOverwrites: OverwriteResolvable[] = [
        {
            id: guild.id,
            allow: (panel.is_public == true) ? ['VIEW_CHANNEL'] : [],
            deny: (panel.is_public == true) ? ['SEND_MESSAGES'] : ['VIEW_CHANNEL']
        }
    ];

    // Ticket Creator Permissions
    arrayOfOverwrites.push({
        id: user.id,
        allow: panel.user_open_permissions as unknown as Permissions[],
        deny: panel.user_open_disallowed_permissions as  unknown as Permissions[]
    })

    // Support Team Permissions

    // Clai
    if (type == 'claim') {
        if (instanceOfCommand(data) === true) throw new Error('Type Error')
        arrayOfOverwrites.push({
            id: data.support_id,
            allow: panel.support_open_permissions as unknown as Permissions[],
            deny: panel.support_open_disallowed_permissions as unknown as Permissions[]

        })
    }
    else {
        if (instanceOfCommand(data) === false) throw new Error('Type Error')
        panel.support_roles.forEach(role => {
            arrayOfOverwrites.push({
                id: role,
                allow: panel.support_open_permissions as unknown as Permissions[],
            deny: panel.support_open_disallowed_permissions as unknown as Permissions[]
            })
        })
    }

    return arrayOfOverwrites
}

function instanceOfCommand(object: Record<string, string>): object is TicketCommandCreateData {
    return 'member' in object;
}
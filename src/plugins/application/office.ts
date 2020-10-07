import DatabaseHandler from "../../handlers/DatabaseHandler";
import { ApplicationSettings } from "../../typings/origin";

function DefaultApplicationSettings (guild_id: string): ApplicationSettings {
    return {
        guild_id: guild_id,
        enabled: false,
        applications: [],
        reviewer_roles: [],
    }
}

export async function CreateApplicationSettings (database: DatabaseHandler, guild_id: string): Promise<ApplicationSettings> {
    return database.insert('modules', 'application', DefaultApplicationSettings(guild_id))
}
import OriginClient from "../lib/OriginClient";
import { CreateVerificationSettings, VerificationSettings, VerificationUser } from "../typings/origin";
import { DatabaseHandler } from "./DatabaseHandler";

export class VerificationHandler {
    constructor(bot: OriginClient) {
        this.database = bot.handlers.database
        this.settings = new VerificationSettingsManager(this.database)
        this.users = new VerificationUserManager(this.database)
    }
    private database: DatabaseHandler
    public settings: VerificationSettingsManager
    public users: VerificationUserManager
    
}

class VerificationSettingsManager {
    constructor(database: DatabaseHandler) {
        this.database = database
    }
    private database: DatabaseHandler

    public async fetch(guild_id: string): Promise<VerificationSettings> {
        return new VerificationSettings(
            await this.database.getOne('modules', 'verification', { guild_id: guild_id }),
            this.database
        )
    }

    public async create(opt: { guild_id: string, verified_role: string, unverified_role?: string }): Promise<VerificationSettings> {
        return new VerificationSettings(
            await this.database.insert(
            'modules', 
            'verification', 
            CreateVerificationSettings(opt.guild_id, opt.verified_role, opt.unverified_role)
            ), this.database)

    }
    
}

class VerificationUserManager {
    constructor(database: DatabaseHandler) {
        this.database = database
    }
    private database: DatabaseHandler

    public async fetch(user_id: string): Promise<VerificationUser> {
        return new VerificationUser(
            await this.database.getOne('verification', 'users', {
            user_id:  user_id
        }), this.database
        )
    }

    public async create(user_id: string, primary_account: number): Promise<VerificationUser> {
        return new VerificationUser(
            await this.database.insert('verification', 'users', {
            user_id: user_id,
            primary_account: primary_account,
            roblox_accounts: []
        }), this.database
        )
    }
}
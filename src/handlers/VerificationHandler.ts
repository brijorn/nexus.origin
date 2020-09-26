/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import OriginClient from "../lib/OriginClient";
import { RoleBindGroup, RankBindType, AssetBindType } from "../typings/origin";
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

class VerificationUser {
	constructor(data: VerificationUser, database: DatabaseHandler) {
		Object.assign(this, data)
		this.database = database
	}
	private database?: DatabaseHandler
	public user_id!: string;
	public primary_account!: number;
	public roblox_accounts!: number[];

	public save(): Promise<void> {
		const obj = { ...this }
		delete obj.database
		if (this.database) this.database.save('verification', 'users', { user_id: this.user_id }, obj)
		return Promise.resolve()
	}
}

export class VerificationSettings {
	constructor(data: VerificationSettings, database: DatabaseHandler) {
		Object.assign(this, data)
		this.database = database
	}
	private database?: DatabaseHandler;
	public readonly guild_id!: string;
	public enabled!: boolean;
	public verified_role!: string;
	public unverified_role!: string;
	public unverified_enabled!: boolean;
	public autoVerify!: boolean;
	public nicknaming!: boolean;
	public nickname_format!: string;
	public dm_verification!: boolean;
	public role_binds!: RoleBindGroup[];
	public rank_binds!: RankBindType[];
	public asset_binds!: AssetBindType[];
	public gamepass_binds!: AssetBindType[];
	public bypass!: {
		bypass_nickname: string;
		update: string;
	};
	[key: string]: any;

	public update(field: keyof this, value: Record<string, string> | Record<any, any>[]): Promise<VerificationSettings> {
        const db = this.database
        return db!
        .updateOne('modules', 'verification', { guild_id: this.guild_id }, { [field]: value })
		.then((result: VerificationSettings) => new VerificationSettings(result, db!))
	}

	public save(): Promise<void> {
		const obj = { ...this }
		delete obj.database
		if (this.database) this.database.save('modules', 'verification', { guild_id: this.guild_id }, obj)
		return Promise.resolve()
	}
}

function CreateVerificationSettings(guildId: string, verifiedRole: string, unverifiedRole?: string) {
    return {
        guild_id: guildId,
        enabled: true,
        verified_role: (verifiedRole) ? verifiedRole : null,
        unverified_role: (unverifiedRole) ? verifiedRole : null,
        unverified_enabled: (unverifiedRole) ? unverifiedRole : false,
        autoVerify: false,
        nicknaming: true,
        nickname_format: "{{robloxname}}",
        dm_verification: false,
        role_binds: [],
        rank_binds: [],
        asset_binds: [],
        gamepass_binds: [],
        bypass: {
            bypass_nickname: "",
            update: "",
        }
    }
}
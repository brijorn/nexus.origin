import db from "..";

interface VerificationUserInterface {
    userId: bigint | string;
    primaryAccount: number;
    robloxAccounts: number[];

}

export class VerificationUser implements VerificationUserInterface {
    constructor() {}
    public readonly userId!: string;
    public primaryAccount!: number;
    public robloxAccounts!: number[];

    public async create(userId: string, robloxAccount: number | string) {
        const user: VerificationUser = await db.withSchema('verification').table('users')
        .returning("*")
        .insert({
            userId: userId,
            primaryAccount: robloxAccount,
            robloxAccounts: []
        })
        return user
    }
    
    public async get(userId: string) {
        const user: VerificationUser = await db.withSchema('verification').table('users')
        .where('userId', '=', userId)
        .first()
        return user
    }
}

export class VerificationSettings {
    constructor(data?: VerificationSettings) {
        if (data) Object.assign(this, data)
     };

    public readonly guild_id!: bigint | string;
    public enabled!: boolean;
    public verifiedRole!: string;
    public unVerifiedRole!: string;
    public unVerifiedEnabled!: Boolean;
    public autoVerify!: boolean;
    public nicknaming!: boolean;
    public nicknameFormat!: string;
    public dmVerification!: boolean;
    public roleBinds!: RoleBindGroup[];
    public rankBinds!: RankBindType[];
    public assetBinds!: AssetBindType[];
    public gamePassBinds!: AssetBindType[];
    public bypass!: {
        bypassNickname: string;
        update: string;
    }

    public async get(guildid: any) {
        const settings = new VerificationSettings(await db.withSchema('modules').table('verification')
        .where('guild_id' as any, '=', guildid)
        .first()
        )
        return settings
    }

    public async update(guildid: any, setting: (keyof this), value: any) {
        const settings = new VerificationSettings(await db.withSchema('modules').table('verification')
        .returning("*")
        .where('guild_id' as any, '=', guildid)
        .first()
        .update({
            [setting]: value
        })
        )
        return settings
    }
    
    public async default(guildid: string | bigint, verifiedRole?: string | bigint, unVerifiedRole?: string | bigint) {
        const settings = new VerificationSettings(await db.withSchema('modules').table('verification')
        .returning("*")
        .insert({
            guild_id: BigInt(guildid),
            enabled: true,
            verifiedRole: (verifiedRole) ? verifiedRole : null,
            unVerifiedRole: (unVerifiedRole) ? unVerifiedRole : null,
            unVerifiedEnabled: (unVerifiedRole) ? true : false,
            autoVerify: false,
            nicknaming: true,
            nicknameFormat: '{{robloxname}}',
            dmVerification: false,
            roleBinds: [],
            rankBinds: [],
            assetBinds: [],
            gamePassBinds: [],
            bypass: {
                bypassNickname: '',
                update: ''
            }
        })
        )
    }
}

// Interface for all regular asset binds
export interface AssetBindType {
    assetId: number;
    hierarchy: number;
    nickname: string;
    roles: bigint[] | string[];
}

// Inerface for ranking binds
export interface RankBindType extends AssetBindType { rank: number }

// Role Bind Stuff
export interface RoleBindGroup {
    id: number;
    main: Boolean;
    binds: GroupBinds[];


}
interface GroupBinds {
    id: number;
    hierarchy: number;
    rank: number;
    roles: bigint[] | string[];
    nickname: string;

}
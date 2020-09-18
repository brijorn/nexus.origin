export interface VerificationUser {
    user_id: bigint | string;
    PrimaryAccount: number;
    RobloxAccounts: number[];

}

export class CreateVerificationUser implements VerificationUser {
    constructor(user_id: bigint | string, RobloxAccount: number) {
        this.user_id = user_id;
        this.PrimaryAccount = RobloxAccount
        this.RobloxAccounts = []
        return this
    }
    user_id: bigint | string;
    PrimaryAccount: number;
    RobloxAccounts: number[];
}

export interface VerificationSettings {
    enabled: boolean;
    VerifiedRole: string;
    UnVerifiedRole: string;
    AutoVerify: boolean;
    Nicknaming: boolean;
    NicknameFormat: string;
    DmVerification: boolean;
    RoleBinds: RoleBindGroup[];
    RankBinds: RankBindType[];
    AssetBinds: AssetBindType[];
    GamePassBinds: AssetBindType[];
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
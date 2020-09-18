export default class GuildSettings {
    constructor(data?: any) { return data }

    guild_id!: BigInt;
    prefix!: string;
    embed!: GuildEmbedSettings;
    token!: any;
}

export interface GuildEmbedSettings {
    title: string,
    color: string,
    footer: string,
    footerlogo: string
}
import OriginClient from "../OriginClient";

export default class Job {
    bot: OriginClient;
    name: string;

    constructor(bot: OriginClient, name: string) {
        this.bot = bot
        this.name = name
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    execute (..._data: unknown[]) {
        throw new Error('Woopsies something broke in the Job Handler.')
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    complete (..._data: unknown[]) {
        throw new Error('Woopsies something broke in the Job Handler.')
    }
}
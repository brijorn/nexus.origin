import OriginClient from '../OriginClient'

export default class Event {
    bot: OriginClient;
    name: string;
    once = false;

    constructor(bot: OriginClient, name: string) {
        this.bot = bot;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    execute(..._args: unknown[]) {
        throw new Error('Woopsies something broke in the Event Handler.')
    }
}
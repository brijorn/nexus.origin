import { join, parse } from 'path';
import { Collection } from 'discord.js'
import klaw from 'klaw';
import OriginClient from '../lib/OriginClient';

export default class EventHandler extends Collection<string, Event> {
    bot: OriginClient;

    constructor(bot: OriginClient) {
        super();

        this.bot = bot;

        this.init();
    }

    async init(): Promise<void> {
        const path = join(__dirname, '..', 'events');
        const start = Date.now();

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);

                if (file.ext && file.ext === '.js') {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const Event = ((r) => r.default || r)(require(join(file.dir, file.base)));
                    const event: Event = new Event(this.bot, file.name, join(file.dir, file.base));

                    this.set(file.name, event);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    this.client[event.once ? 'once' : 'on'](event.name, (...args: unknown[]) => event.execute(...args));
                }
            })
            .on('end', () => {
                console.log(`Loaded ${this.size} Events in ${Date.now() - start}ms`);
            });
        return Promise.resolve()
    }
}

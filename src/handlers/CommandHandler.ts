import Command from "../lib/structures/Command";
import { join, parse } from 'path'
import { Client, Collection } from "discord.js";
import klaw from 'klaw'
import OriginClient from "../lib/OriginClient";
export default class CommandHandler extends Collection<string, Command> {
    bot: OriginClient;
    constructor(bot: OriginClient) {
        super();
        this.bot = bot;
    }

    async init() {
        const path = join(__dirname, '..', 'commands');
        const start = Date.now();
        klaw(path)
        .on('data', (item) => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== '.js') return;
            const req = ((r) => r.default || r)(require(join(file.dir, file.base)));
            const newReq = new req(this.bot, file.name, join(file.dir, file.base)) as Command;

            this.set(file.name, newReq);
        })
        .on('end', () => {
            console.log(`Loaded ${this.size} Commands in ${Date.now() - start}ms`);

            return this;
        });
    }

    fetch(name: string): Command | null {
        if (this.has(name)) return this.get(name) as Command

        const alias = this.find(command => command.aliases.includes(name))

        return alias ? (this.get(alias.name) as Command) : null;
    }
    
}
/* eslint-disable @typescript-eslint/no-var-requires */
import Command from "../lib/structures/Command";
import { join, parse } from 'path'
import { Collection } from "discord.js";
import klaw from 'klaw'
import OriginClient from "../lib/OriginClient";
export default class CommandHandler extends Collection<string, Command> {
    bot: OriginClient;
    constructor(bot: OriginClient) {
        super();
        this.bot = bot;

        this.init().catch((err) => Promise.reject(new Error('Error Loading Commands.')))
    }

    async init(): Promise<CommandHandler> {
        const path = join(__dirname, '..', 'commands');
        const start = Date.now();
        klaw(path)
        .on('data', (item) => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== '.js') return;
            const req = ((r) => r.default || r)(require(join(file.dir, file.base)));
            const newReq = new req(this.bot, file.name, join(file.dir, file.base)) as Command;
            const MODULE_REGEX = /[^\\]+$/
            const module = MODULE_REGEX.exec(file.dir)
            if (!module) throw new Error('COULD NOT FIND COMMAND MODULE')
            newReq.module = module[0]
            this.set(newReq.name, newReq);
        })
        .on('end', () => {
            console.log(`Loaded ${this.size} Commands in ${Date.now() - start}ms`);

            return this;
        });
        return this
    }

    fetch(name: string): Command | null {
        name = name.toLowerCase()
        if (this.has(name)) return this.get(name) as Command
        const alias = this.find(command => command.aliases.includes(name))

        return alias ? (this.get(alias.name) as Command) : null;
    }
    
}
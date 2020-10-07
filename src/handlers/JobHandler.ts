import OriginClient from "../lib/OriginClient";
import PgBoss from 'pg-boss'
import klaw from 'klaw';
import { join, parse } from 'path';
import { Collection } from "discord.js";
import Job from "../lib/structures/Job";

export default class JobHandler {
    private bot: OriginClient
    private boss: PgBoss
    jobs!: Collection<string, Job>
    constructor(bot: OriginClient) {
        this.bot = bot;
        
        if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_HOST || !process.env.DB) Promise.reject(new Error('Missing Database Information'))
        
        this.boss = new PgBoss({
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            user: process.env.DB_USER,
            database: process.env.DB,
        })
        this.start()
        .then(async () => await this.loadJobs())
        .catch((err) => console.log(err))

        this.boss.on('error', (err) => console.error(err))

        this.jobs = new Collection()

        
    }

    public start (): Promise<PgBoss> {
        
        return Promise.resolve(this.boss.start())
    }

    private loadJobs (): void {
        const path = join(__dirname, '..', 'jobs');
        const start = Date.now();

        klaw(path)
            .on('data', async (item) => {
                const file = parse(item.path);
                if (file.ext && file.ext === '.js') {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const Job = ((r) => r.default || r)(require(join(file.dir, file.base)));
                    const job: Job = new Job(this.bot, file.name, join(file.dir, file.base));

                    this.jobs.set(file.name, job);
                    await this.boss.subscribe(file.name, (...args: unknown[]) => job.execute(this.bot, ...args))
                    await this.boss.onComplete(file.name, (...args: unknown[]) => job.complete(this.bot, ...args))
                }
            })
            .on('end', () => {
                console.log(`Loaded ${this.jobs.size} Jobs in ${Date.now() - start}ms`);
            });
    }

    public queue (opt: PgBoss.Request): Promise<string|null> {
        return this.boss.publish(opt)
    }
    public cancel (id: string): Promise<void> {
        return this.boss.cancel(id)
    }

}
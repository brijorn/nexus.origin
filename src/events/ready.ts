import Event from '../lib/structures/Event';

export default class extends Event {
	async execute(): Promise<void> {
		await this.bot.handlers.job.start();
		return console.log(`Bot Connected`);
	}
}

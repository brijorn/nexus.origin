import DatabaseHandler from "../../handlers/DatabaseHandler";

export class SuggestionSettings {
	constructor(database: DatabaseHandler) {
		this.database = database
	}

	private database: DatabaseHandler;
	public readonly guild_id!: string | bigint;
	public enabled!: boolean;
	public channel!: string;
	public amount!: string;
	public suggestion_cooldown!: number;
	public first_reaction!: string;
	public second_reaction!: string;
	public whitelisted_roles!: string[];
	public blacklisted_roles!: string[];
	public admin_roles!: string[];

	fetch(guild_id: string): Promise<SuggestionSettings> {
			return this.database.getOne('modules', 'suggestion', {
				'guild_id': guild_id
			})
	}

	increment(amount: number): Promise<SuggestionSettings> {
		return this.database.updateOne('modules', 'suggestion', {
			'guild_id': this.guild_id
		}, { case: amount })
	}
}
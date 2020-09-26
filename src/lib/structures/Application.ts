import { DatabaseHandler } from "../../handlers/DatabaseHandler";

export class ApplicationSettings {
	constructor(database: DatabaseHandler, data?: ApplicationSettings) {
		if (data) Object.assign(this, data)
		this.database = database
	}
	private database: DatabaseHandler;
	public readonly guild_id!: string | bigint;
	public enabled!: boolean;
	public applications!: Application[];
	public reviewer_roles!: string[];

	public fetch(where: Record<string, string>): Promise<ApplicationSettings> {
		return this.database.getOne('modules', 'applications', where)
	}

	public update(where: Record<string, string>, data: Record<string, string>): Promise<ApplicationSettings> {
		return this.database.updateOne('modules', 'applications', where, data)
	}
}

interface Application {
	name: string;
	available: boolean;
	require_verification: boolean;
	questions: string[];
	response_channel: string;
}
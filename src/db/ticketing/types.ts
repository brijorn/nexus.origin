export interface Panel {
	// Guild
	guild_id: BigInt;
	// Interface Information
	interface_name: string;
	interface_enabled: Boolean;
	interface_id: bigint;
	ticket_count: BigInt;
	// MISC
	is_public: Boolean;
	claim_system: Boolean;
	// CONFIRMATION
	confirm_close: Boolean;
	confirm_delete: Boolean;
	// TICKET MESSAGE
	ticket_name: string;
	// REACTION MESSAGE
	message_id: bigint;
	message_reaction: string;
	remove_on_react: Boolean;
	// MESSAGES
	open_message: Object;
	close_message: Object;
	// CATEGORY
	open_category: string;
	close_category: string;
	// CREATION SETTINGS
	create_reaction: string;
	create_dm_prompt: Boolean;
	create_require_title: Boolean;
	create_require_description: Boolean;
	create_allowed_roles: BigInt[];
	create_disallowed_roles: BigInt[];
		// COMMAND
	// COMMAND
	allow_command_create: Boolean;
	command_dm_prompt: Boolean;
	command_require_title: Boolean;
	command_require_description: Boolean;
	// DM NOTIFICATIONS
	// DM NOTIFICATIONS
	open_dm_notify: Boolean;
	close_dm_notify: Boolean;
	// SUPPORT
	// SUPPORT
	support_roles: BigInt[];
	// PERMISSIONS
		// OPEN
	// PERMISSIONS
	// OPEN
	user_open_permissions: string[];
	user_open_disallowed_permissions: string[];
	support_open_permissions: string[];
	support_open_disallowed_permissions: string[];
		// CLOSE
	// CLOSE
	user_close_permissions: string[];
	user_close_disallowed_permissions: string[];
	support_close_permissions: string[];
	support_close_disallowed_permissions: string[];
	// TRANSCRIPT
	// TRANSCRIPT
	transcript: Boolean;
	// LOGGING
	// LOGGING
	log_enabled: Boolean;
	log_channel: BigInt;
	log_claim: Boolean;
	log_open: Boolean;
	log_close: Boolean;
	log_delete: Boolean;
	log_transcript: Boolean;
	log_transcript_create: Boolean;
	// REACTIONS
	// REACTIONS
	close_reaction: string;
	get_transcript: string;
	// CLAIM SYSTEM
	// CLAIM SYSTEM
	claim_channel: BigInt;
	claim_reaction: string;
	claim_message: Object;
	claim_allowed_roles: BigInt[];
}

export class NewPanel implements Panel {
		// Interface Information
		guild_id: bigint

        interface_name: string = 'help'
		interface_enabled: boolean = true
		interface_id!: bigint
        ticket_count: bigint = 0n
        // MISC
        is_public: boolean = false
        claim_system: boolean = false
        // CONFIRMATION
        confirm_close: boolean = true
        confirm_delete: boolean = true
        // TICKET MESSAGE
        ticket_name: string = 'ticket-{{count}}'
        // REACTION MESSAGE
        message_id: bigint = 0n
        message_reaction: string = '📩'
        remove_on_react: boolean = true
        // MESSAGES
        open_message: JSON
        close_message: JSON
        // CATEGORY
        open_category: string = 'Tickets'
        close_category: string = 'Closed Tickets'
        // CREATION SETTINGS
        create_reaction: string = '📥'
        create_dm_prompt: boolean = false
        create_require_title: boolean = true
        create_require_description: boolean = true
        create_allowed_roles: bigint[] = []
        create_disallowed_roles: bigint[] = []
          // COMMAND
        allow_command_create: boolean = true
        command_dm_prompt: boolean = true
        command_require_title: boolean = true
        command_require_description: boolean = true
        // DM NOTIFICATIONS
        open_dm_notify: boolean = true
        close_dm_notify: boolean = true
        // SUPPORT
        support_roles: bigint[] = []
        // PERMISSIONS
            // OPEN
        user_open_permissions: string[] = ['VIEW_CHANNEL', 'SEND_MESSAGES']
        user_open_disallowed_permissions: string[] = []
        support_open_permissions: string[] = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
        support_open_disallowed_permissions: string[] = [];
            // CLOSE
        user_close_permissions: string[] = ['VIEW_CHANNEL'];
        user_close_disallowed_permissions: string[] = [];
        support_close_permissions: string[] = ['SEND_MESSAGES', 'VIEW_CHANNEL'];
        support_close_disallowed_permissions: string[] = [];
        // TRANSCRIPT
        transcript: boolean = true;
        // LOGGING
        log_enabled: boolean = false;
		log_channel: bigint = 0n;
		log_claim: boolean = true;
        log_open: boolean = true;
        log_close: boolean = true;
        log_delete: boolean = true;
        log_transcript: boolean = true;
        log_transcript_create: boolean = true;
        // REACTIONS
        close_reaction: string = '🔒';
        get_transcript: string = '📁';
        // CLAIM SYSTEM
        claim_channel: bigint = 0n;
        claim_reaction: string = '💻';
        claim_message: JSON;
		claim_allowed_roles: bigint[] = []
		
        constructor(guildid: any, opendata: JSON, closedata: JSON, claimdata: JSON) { 
			this.guild_id = guildid;
			this.open_message = opendata;
			this.close_message = closedata;
			this.claim_message = claimdata;
			this.create_allowed_roles.push(guildid)
			return this
		}
}
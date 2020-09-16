CREATE TABLE "ticketing"."ticket_interfaces" (
	-- Guild
	guild_id bigint,
	-- Interface Information
	interface_name text,
	interface_enabled boolean,
	interface_id SERIAL PRIMARY KEY,
	ticket_count bigint,
	-- MISC
	is_public boolean,
	claim_system boolean,
	-- CONFIRMATION
	confirm_close boolean,
	confirm_delete boolean,
	-- TICKET MESSAGE
	ticket_name text,
	-- REACTION MESSAGE
	message_id text,
	message_reaction text,
	remove_on_react boolean,
	-- MESSAGES
	open_message json,
	close_message json,
	-- CATEGORY
	open_category text,
	close_category text,
	-- CREATION SETTINGS
	create_reaction text,
	create_dm_prompt boolean,
	create_require_title boolean,
	create_require_description boolean,
	create_allowed_roles bigint[],
	create_disallowed_roles bigint[],
		-- COMMAND
	allow_command_create boolean,
	command_dm_prompt boolean,
	command_require_title boolean,
	command_require_description boolean,
	-- DM NOTIFICATIONS
	open_dm_notify boolean,
	close_dm_notify boolean,
	-- SUPPORT
	support_roles bigint[],
	-- PERMISSIONS
		-- OPEN
	user_open_permissions text[],
	user_open_disallowed_permissions text[],
	support_open_permissions text[],
	support_open_disallowed_permissions text[],
		-- CLOSE
	user_close_permissions text[],
	user_close_disallowed_permissions text[],
	support_close_permissions text[],
	support_close_disallowed_permissions text[],
	-- TRANSCRIPT
	transcript boolean,
	-- LOGGING
	log_enabled boolean,
	log_channel bigint,
	log_claim boolean,
	log_open boolean,
	log_close boolean,
	log_delete boolean,
	log_transcript boolean,
	log_transcript_create boolean,
	-- REACTIONS
	close_reaction text,
	get_transcript text,
	-- CLAIM SYSTEM
	claim_channel bigint,
	claim_reaction text,
	claim_message json,
	claim_allowed_roles bigint[]
	
);
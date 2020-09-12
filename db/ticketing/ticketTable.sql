CREATE TABLE "ticketing"."tickets" (
	-- IDS
	guild_id bigint,
	ticket_id bigint PRIMARY KEY,
	interface_id bigint,
	
	-- STATUS
	status text,
	-- USER
	ticket_user bigint,
	
	-- TICKET INFO
	channel_id bigint,
	message_id bigint,
	ticket_title text,
	ticket_description text,
	-- CLAIM INFO
	ticket_claimer bigint,
	claim_timestamp bigint,
	-- TIMESTAMPS
	open_timestamp bigint,
	close_timestamp bigint
);
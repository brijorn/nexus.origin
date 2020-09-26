CREATE TABLE ticketing.tickets (
	ticket_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	guild_id bigint NOT NULL,
	interface_id uuid,
	status text,
	user_name text,
	user_id bigint,
	user_avatar text,
	channel_id bigint,
	menu_id bigint,
	title bigint,
	description bigint,
	support_name text,
	support_id bigint,
	support_avatar text
	
	
);
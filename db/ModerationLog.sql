CREATE TABLE logs.moderation (
	guild_id bigint NOT NULL,
	case_id bigint NOT NULL,
	user_id bigint NOT NULL,
	user_tag text NOT NULL,
	mod_id bigint NOT NULL,
	mod_tag text NOT NULL,
	type text NOT NULL,
	reason text,
	duration bigint default 0
);
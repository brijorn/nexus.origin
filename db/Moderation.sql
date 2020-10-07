CREATE TABLE IF NOT EXISTS modules.moderation (
    guild_id bigint PRIMARY KEY NOT NULL,
    mod_enabled boolean,
	cases int 0,
    mod_roles text[],

    -- Kick Command
    kick_enabled boolean,
    kick_roles text[],
    kick_require_reason boolean,
    kick_message text,

    -- Ban Command
    ban_enabled boolean,
    ban_roles text[],
    ban_require_reason boolean,
    ban_message text,

    -- Mute Command
    mute_enabled boolean,
    muted_role bigint DEFAULT 0,
    mute_roles text[],
    mute_message text,
    unmute_message text,

    -- Warn Command
    warn_enabled boolean,
    warn_roles text[],
    warn_message text,

    -- Purge
    purge_enabled boolean DEFAULT false,

    -- Log
    mod_log bigint DEFAULT 0


);
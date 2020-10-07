CREATE TABLE IF NOT EXISTS modules.application (
    guild_id BIGINT PRIMARY KEY NOT NULL,
    enabled boolean,
    applications jsonb[],
    reviewer_roles text[]

);
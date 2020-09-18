"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPanel = exports.Panel = void 0;
class Panel {
    constructor(data) {
        return data;
    }
    ;
}
exports.Panel = Panel;
class NewPanel {
    constructor(guildid, opendata, closedata, claimdata) {
        guild_id: guildid;
        // Interface Information
        interface_name: 'help';
        interface_enabled: true;
        ticket_count: 0;
        // MISC
        is_public: false;
        claim_system: false;
        // CONFIRMATION
        confirm_close: true;
        confirm_delete: true;
        // TICKET MESSAGE
        ticket_name: 'ticket-{{count}}';
        // REACTION MESSAGE
        message_id: 0;
        message_reaction: '📩';
        remove_on_react: true;
        // MESSAGES
        open_message: opendata;
        close_message: closedata;
        // CATEGORY
        open_category: 'Help';
        close_category: 'Closed Help';
        // CREATION SETTINGS
        create_reaction: '📥';
        create_dm_prompt: false;
        create_require_title: true;
        create_require_description: true;
        create_allowed_roles: [guildid];
        create_disallowed_roles: [];
        // COMMAND
        allow_command_create: true;
        command_dm_prompt: true;
        command_require_title: true;
        command_require_description: true;
        // DM NOTIFICATIONS
        open_dm_notify: true;
        close_dm_notify: true;
        // SUPPORT
        support_roles: [];
        // PERMISSIONS
        // OPEN
        user_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'];
        user_open_disallowed_permissions: [];
        support_open_permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'];
        support_open_disallowed_permissions: [];
        // CLOSE
        user_close_permissions: ['VIEW_CHANNEL'];
        user_close_disallowed_permissions: [];
        support_close_permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'];
        support_close_disallowed_permissions: [];
        // TRANSCRIPT
        transcript: true;
        // LOGGING
        log_enabled: true;
        log_channel: 0;
        log_open: true;
        log_close: true;
        log_delete: true;
        log_transcript: true;
        log_transcript_create: true;
        // REACTIONS
        close_reaction: '🔒';
        get_transcript: '📁';
        // CLAIM SYSTEM
        claim_channel: 0;
        claim_reaction: '💻';
        claim_message: claimdata;
        claim_allowed_roles: [];
        return this;
    }
}
exports.NewPanel = NewPanel;

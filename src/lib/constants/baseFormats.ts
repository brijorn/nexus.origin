/* eslint-disable no-useless-escape */
export const GuildMemberFormats = [
    {
		name: '{{member.user.id}}',
		description: 'The id of the member.user',
		value: 'member.user.name',
	},
	{
		name: '{{member.user.username}}',
		description: 'The member.username of the member.user',
		value: 'member.user.name',
    },
    {
		name: '{{member.user.discriminator}}',
		description: 'The #discriminator of the member.user',
		value: 'member.user.discriminator',
	},
	{
		name: '{{member.user.avatar}}',
		description: "Changes to the member.user's avatar",
		value: 'member.user.avatarURL() || member.user.defaultAvatarURL()',
	},
	{
		name: '{{member.user.nickname}}',
        description: "Changes to the member.user's nickname",
        value: "(member.user.nickname) ? member.user.nickname : 'None'"
    },
    {
		name: '{{member.user.createdat}}',
		description: 'The creation date of the member.user',
		value: 'member.user.createdAt',
    },
    {
		name: '{{member.user.tag}}',
		description: 'The discord tag of the member.user: potato#001',
		value: 'member.user.tag',
    },
    {
        name: '{{member.guild.id}}',
        description: 'The id of the guild the member is in',
        value: 'member.guild.id'
    },
    {
        name: '{{member.guild.name}}',
        description: 'The name of the guild the member is in',
        value: 'member.guild.name'
    },
    {
        name: '{{member.guild.icon}}',
        description: 'The icon URL of the guild the member is in',
        value: 'member.guild.iconURL()'
    },
    
];


export const ModerationFormats = [
  {
    name: '{{reason?}}',
    description: 'Runs the code within the {{reason}}text-here{{end}} code.',
    value: `
      const REASON_REGEX = /(?<={{reason\?}})(.*?)(?={{end}})/g
      if (reason !== 'None') REASON_REGEX.exec(text)?.shift()[0]
      else ''`
    }
]
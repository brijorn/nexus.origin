/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorResolvable, Message, MessageEmbed, MessageOptions } from "discord.js";
import { EmbedFields, GuildSettings } from "../../typings/origin";
import { prompt as promptFunction, dmprompt as dmPromptFunction} from '../../lib/util/prompt/'
import embed, { RegularEmbed } from "../../functions/embed";
enum Colors {
	GREEN_SUCCESS = "#3bff86",
	RED_FAILURE = "#ff6257",
}
export default class OriginMessage extends Message {
	public guildembed(
		title: any,
		description: any,
		guild: GuildSettings,
		color?: ColorResolvable,
		footer?: boolean | string,
		timestamp?: boolean
	) {
		
		return this.send(embed(title, description, guild, color, footer, timestamp));
	}
	
	public embed(
		opt: EmbedFields
	) {
		return this.send(RegularEmbed(opt))
	}

	public dmembed(
		opt: EmbedFields
	) {
		return this.send(RegularEmbed(opt))
	}

    public success(content: string, title?: string) {
        return this.send(
            new MessageEmbed()
            .setTitle(title || 'Success')
            .setDescription(content)
            .setColor(Colors.GREEN_SUCCESS)
        )
    }

    public failure(content: string, title?: string) {
        return this.send(
            new MessageEmbed()
            .setTitle(title || 'Failure')
            .setDescription(content)
            .setColor(Colors.RED_FAILURE)
        )
    }

    public error(content: string, title?: string) {
        return this.send(
            new MessageEmbed()
            .setTitle(title || 'Error')
            .setDescription(content)
            .setColor(Colors.RED_FAILURE)
        )
    }
    
    public send(content: string | MessageEmbed,
        embed?: EmbedFields,
        options?: MessageOptions) {
		if (embed) {
			return this.channel.send(RegularEmbed(embed))
		}
        if (typeof content === 'string') {
            return this.channel.send(content, { ...options, embed });
        }
        return this.channel.send(content);
	}

	public dm(content: string | MessageEmbed,
		embed?: MessageEmbed,
		options?: MessageOptions) {
			if (typeof content === 'string') {
				return this.author.send(content, { ...options, });
			}
			return this.author.send(content);
		}
	
	public dmprompt(content: string | MessageEmbed,
		embed?: MessageEmbed,
		options?: MessageOptions,
		lower?: boolean) {
			if (!lower) lower = false
			if (typeof content === 'string') {
				return dmPromptFunction(this, content, lower)
			}
			return dmPromptFunction(this, content, lower)
		}
	
	public prompt(content: string | MessageEmbed,
		embed?: EmbedFields,
		options?: MessageOptions,
		lower?: boolean) {
			if (!lower) lower = false
			if (embed) {
				return promptFunction(this, RegularEmbed(embed), lower)
			}
			else if (typeof content === 'string') {
				return promptFunction(this, content, lower)
			}
			return promptFunction(this, content,lower)
		}
}

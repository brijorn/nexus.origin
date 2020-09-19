import editStart from './editStartPrompt';
import editPrompt from './editprompt';
import delprompt from './delprompt';
import tokenprompt from './tokenprompt';
import prompt from './prompt';
import dmprompt from './pmprompt';
import { Message } from 'discord.js';
export default { 
	prompt, 
	dmprompt, 
	delprompt, 
	tokenprompt,
	editStart, 
	editPrompt
}
// Prompts
export {
	prompt, 
	dmprompt, 
	delprompt, 
	tokenprompt,
	editStart, 
	editPrompt
}


// Interfaces

export interface startPromptInterface {
	message: Message,
	content: string
}

export interface editPromptInterface {
	content: string
}
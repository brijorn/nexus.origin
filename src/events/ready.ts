import Event from "../lib/structures/Event";

export default class extends Event {
    execute(): void {
        return console.log(`Bot Connected`)
    }
}
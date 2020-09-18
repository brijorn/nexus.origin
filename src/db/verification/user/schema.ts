import { Message } from "discord.js";
import db from "../..";
import { CreateVerificationUser, VerificationUser } from "../types";

export async function CreateUser(user_id: bigint | string, RobloxAccount: number) {
	const user: VerificationUser = await db
		.withSchema("verification")
        .table("users")
        .returning("*")
        .insert(new CreateVerificationUser(user_id, RobloxAccount));
    return user
}

export async function GetUser(user_id: any) {
    const user: VerificationUser = await db
    .withSchema('verification')
    .table('users')
    .where('user_id' as any, '=', user_id)
    .first()
    return user
}
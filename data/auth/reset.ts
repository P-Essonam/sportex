"use server";
import { ResetSchema } from "@/schemas";
import { error } from "console";
import * as z from "zod";
import { getUserByEmail, getUserById } from ".";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetToken } from "@/lib/mail";


export const reset = async(
    values: z.infer<typeof ResetSchema>,
) => {

    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email)

    if(!existingUser){
        return { error: "Email not found!"}
    }

    const passwordResetToken = await generatePasswordResetToken(email)

    await sendPasswordResetToken(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: "Reset email sent!"}

}
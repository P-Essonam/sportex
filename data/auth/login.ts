"use server"

import { LoginSchema } from "@/schemas"
import * as z from "zod"
import { getUserByEmail } from "."
import { generateVerificationToken } from "@/lib/token"
import { sendTwoFactorTokenEmail } from "@/lib/mail"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"


export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl: string | null
) => {

    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.password || !existingUser.email) {
        return { error: "Email does not exist!"}
    }

    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)

        await sendTwoFactorTokenEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { twoFactor: true, success: "OTP code sent!" }
    }

    try {
        await signIn(
            "credentials",
            {
                email,
                password,
                redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
            }
        )
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type){
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "An error occurred!" } 
            }
        }

        throw error
    }

}
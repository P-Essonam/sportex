import { getPasswordResetTokenByEmail, getVerificationTokenByEmail } from "@/data/auth"
import { db } from "./db"

import { v4 as uuidv4 } from 'uuid'


export const generateVerificationToken = async (email: string) => {

    const randomNumber = Math.floor(Math.random() * 1000000)
    const sixDigitCode = randomNumber.toString().padStart(6, '0')
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000 )

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token: sixDigitCode,
            expires
        }
    })

    return verificationToken
}


export const generatePasswordResetToken = async (email: string) => {

    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    if( existingToken){
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken

}
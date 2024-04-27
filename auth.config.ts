import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/auth";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";



export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success){
                    const { email, password } = validatedFields.data;


                    
                    const user = await getUserByEmail(email);

                    if( !user || !user.password) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                
                }

                return null;
            }

        })
    ]
} satisfies NextAuthConfig;
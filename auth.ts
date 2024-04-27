import NextAuth from "next-auth"
import { db } from "./lib/db"
import { getUserById } from "./data/auth"
import { UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"

 
export const { 
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/error",
    },

    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    emailVerified: new Date()
                }
            })

            await db.coach.create({
                data: {
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })
        },

        async signIn({ user}) {
            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    lastLogin: new Date()
                }
            })
        }
    },

    callbacks: {
        async signIn({ user, account,}) {
            //autoriser oauth sans verification de email
            if(account?.provider !== "credentials") return true

            if (user.id){
                const existingUser = await getUserById(user.id)
                if (!existingUser ||  !existingUser.emailVerified){
                    return false
                }
            }

            return true
        },

        async session({ token, session }){
            if (token.sub && session.user ){
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            return session
        },

        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token

            token.role = existingUser.role

            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 30 * 60,
    },
    ...authConfig,



})
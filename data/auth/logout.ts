"use server"

import { signOut } from "@/auth"

export const logOut = async () => {
    // votre code ici avant la deconnexion
    await signOut()
}
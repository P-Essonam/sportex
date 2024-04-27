import Unauthorized from '@/components/unauthorized'
import { getCurrentUser } from '@/data'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {

    const user = await currentUser()
    if (!user || !user.email) redirect("/sign-in")

    const userDetails = await getCurrentUser()

    if(!userDetails) return <Unauthorized />

    if (userDetails.role === "ADMIN") {

    } else if (userDetails.role === "COACH" && userDetails.Coach) {

      return redirect(`/coach/${userDetails.Coach.id}/specialities`)
    } else if( userDetails.role === "GUEST" && userDetails.Customer) {
        return redirect(`/guest/${userDetails.Customer.id}/specialities`)
    }


    return <Unauthorized />
}

export default page
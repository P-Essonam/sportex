import CreateSpecialityForm from '@/components/forms/CreateSpecialityForm'
import Unauthorized from '@/components/unauthorized'
import { getSpeciality } from '@/data'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'


type Props = {
    params : {
        guestId: string
    }
}

const page = async({ params } : Props) => {

    const user = await currentUser()
    if( !user || !user.email) return redirect('/check')

    const currentSpeciality = await getSpeciality()   

    if(currentSpeciality) return redirect(`/guest/${params.guestId}/specialities/${currentSpeciality}`)


    return <Unauthorized />
}

export default page
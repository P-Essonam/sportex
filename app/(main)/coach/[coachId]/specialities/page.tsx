import CreateSpecialityForm from '@/components/forms/CreateSpecialityForm'
import { getSpeciality } from '@/data'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'


type Props = {
    params : {
        coachId: string
    }
}

const page = async({ params } : Props) => {

    const user = await currentUser()
    if( !user || !user.email) return redirect('/check')

    const currentSpeciality = await getSpeciality()   

    if(currentSpeciality) return redirect(`/coach/${params.coachId}/specialities/${currentSpeciality}`)


    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className=' flex justify-center items-center mt-4'>
                <div className=' max-w-[850px] border p-4 rounded-xl overflow-x-hidden'>
                    <h1 className='sm:text-4xl text-2xl whitespace-nowrap'>
                        Add a new speciality 
                    </h1>

                    <CreateSpecialityForm />
                </div>
            </div>
        </div>
    )
}

export default page
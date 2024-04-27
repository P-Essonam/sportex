import HeaderCoach from '@/components/global/HeaderCoach'
import Unauthorized from '@/components/unauthorized'
import { getCurrentCoach } from '@/data'
import React from 'react'


type Props = {
    children: React.ReactNode
    params: {
        coachId: string
        specialityId: string
    }
}



const layout = async({ children, params } : Props) => {

    const authUSer = await getCurrentCoach()

    if(!authUSer) return <Unauthorized />

    return (
        <div className='w-full'>
            <HeaderCoach params={params} user={authUSer.User} speciality={authUSer.Speciality}/>
            <div className='overflow-x-hidde'>
                {children}
            </div>
        </div>
    )
}

export default layout
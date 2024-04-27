
import HeaderGuest from '@/components/global/HeaderGuest'
import Unauthorized from '@/components/unauthorized'
import { getCurrentGuest } from '@/data'

import React from 'react'


type Props = {
    children: React.ReactNode
    params: {
        guestId: string,
        specialityId: string
    }
}
const layout = async({ children,params } : Props) => {

  const authUser = await getCurrentGuest()
  if (!authUser) return <Unauthorized />

  return (
    <div className='w-full'>
      <HeaderGuest params={params} user={authUser.User} speciality={authUser.Speciality}/>
      <div className='overflow-x-hidden'>
        {children}
      </div>
    </div>
  )
}

export default layout
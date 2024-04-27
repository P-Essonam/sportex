import React from 'react'


import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import Unauthorized from '@/components/unauthorized'
import { getCurrentGuest, getCurrentUser } from '@/data'
import { Separator } from '@/components/ui/separator'
import SettingsForm from '@/components/forms/SettingsForm'
import GuestForm from '@/components/forms/GuestForm'


type Props = {
    params: {
        guestId: string
        specialityId: string
    }
}


const page = async({ params } : Props) => {

    const authUser = await getCurrentGuest()
    const user = await getCurrentUser()
    if (!authUser || !user || !user.Customer) return <Unauthorized />

    

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="w-full h-full py-8 sm:px-10 px-4 space-y-4">
                <div>
                    <h1 className='text-3xl tracking-normal font-semibold'>Settings</h1>
                    <p className='text-md text-foreground/50'>Manage your account settings and contact support.</p>
                </div>
                <Separator />

                <Tabs  defaultValue="account" className="w-full max-md:space-y-8 flex md:items-start flex-col md:flex-row md:space-x-10">
                    <div className='md:w-[250px]'>
                        <TabsList className='md:flex md:flex-col md:space-y-6 md:bg-transparent md:h-full md:items-start md:w-full '>
                            <TabsTrigger value="account"className='md:block md:w-full md:text-left md:rounded-xl md:p-2'>Account</TabsTrigger>
                        </TabsList>
                    </div>
                    

                    <TabsContent value="account" className='w-full'>
                        <div>
                            <h1 className='text-2xl'>Account</h1>
                            <p className='text-foreground/50'>Manage your account settings</p>
                        </div>
                        <div className='flex md:flex-row flex-col justify-between w-full md:space-x-4'>
                            <SettingsForm  user={authUser.User}/>
                            <GuestForm customer={user.Customer}/>
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
      </div>
    )
}

export default page
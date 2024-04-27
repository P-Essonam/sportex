import { Separator } from '@/components/ui/separator'
import Unauthorized from '@/components/unauthorized'
import { getCurrentCoach } from '@/data'
import React from 'react'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import SettingsForm from '@/components/forms/SettingsForm'
import SupportForm from '@/components/forms/SupportForm'


const page = async() => {

    const authUser = await getCurrentCoach()
    if(!authUser) return <Unauthorized />


    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <div className='w-full h-full py-8 sm:px-10 px-4 space-y-4'>
                <div>
                    <h1 className='text-3xl tracking-normal font-semibold'>Settings</h1>
                    <p className='text-md text-foreground/50'>Manage your account settings and contact support</p>
                </div>

                <Separator />

                <Tabs defaultValue='account' className='w-full'>
                    <div className='md:w-[250px]'>
                        <TabsList className='md:flex md:flex-col md:space-y-6 md:bg-transparent md:h-full md:items-start md:w-full'>
                            <TabsTrigger value="account" className='md:block md:w-full md:text-left md:rounded-xl md:p-2'>Account</TabsTrigger>
                            <TabsTrigger value="support" className='md:block md:w-full md:text-left md:rounded-xl md:p-2'>Support</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value='account' className='w-full'>
                        <div>
                            <h1 className='text-2xl'>Account</h1>
                            <p className='text-muted-foreground/50'>Manage your account settings</p>
                        </div>
                        
                        <SettingsForm  user={authUser.User} />
                    </TabsContent>
                    <TabsContent value='support' className='w-full'>
                        <div>
                            <h1 className='text-2xl'>Support</h1>
                            <p className='text-muted-foreground/50'>Contact our client support</p>
                        </div>

                        <SupportForm  user={authUser.User}/>
                    </TabsContent>

                </Tabs>

            </div>
        </div>
    )
}

export default page
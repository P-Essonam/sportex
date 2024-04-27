import React from 'react'
import Unauthorized from '@/components/unauthorized'
import { getCurrentCoach } from '@/data'



import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import Link from 'next/link'
import AddCustomer from './_components/AddCustomer'
import All from './_components/All'
import Active from './_components/Active'
import Archived from './_components/Archived'




type Props = {
    params: {
        coachId: string
        specialityId: string
    }
}


const page = async({ params } : Props) => {

    const authUser = await getCurrentCoach()
    if ( !authUser ) return <Unauthorized />


    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <div className='w-full h-full sm:gap-4 sm:py-8 sm:pl-4'>
                <Breadcrumb className='hidden md:flex p-4 sm:px-6 sm:pb-8 pt-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers`}>
                                        Customers
                                    </Link>
                                </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

                <main className='flex flex-1 gap-4 sm:px-6 sm:py-0 md:gap-8'>
                    <Tabs defaultValue='all' className='w-full'>
                        <div className='flex items-center'>
                            <TabsList>
                                <TabsTrigger value='all'>All</TabsTrigger>
                                <TabsTrigger value='active'>Active</TabsTrigger>
                                <TabsTrigger value='archived' className='hidden sm:flex'>Archived</TabsTrigger>
                            </TabsList>

                            <div className='ml-auto flex items-center gap-2'>
                                <AddCustomer />
                            </div>
                        </div>

                        <All params={params} />
                        <Active params={params} />
                        <Archived params={params} />

                    </Tabs>

                </main>
            </div>
        </div>
    )
}

export default page
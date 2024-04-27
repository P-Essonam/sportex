import Unauthorized from '@/components/unauthorized'
import { getAllSessions, getCurrentCoach, getCustomerDetails } from '@/data'
import React from 'react'


import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from '@/components/ui/card'
import ProgramGoalCalendar from '@/components/global/ProgramGoalCalendar'
import Link from 'next/link'


type Props = {
    params: {
        coachId: string
        specialityId: string
        customerId: string
        programId: string
        goalId: string
    }
}
const page = async({ params } : Props) => {

    const authUser = await getCurrentCoach()
    if (!authUser || !authUser.User) return <Unauthorized/>
    let allSessions = await getAllSessions(params.goalId)

    const customerDetails = await getCustomerDetails(params.customerId)



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
                        <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers/${params.customerId}/programs`}>
                                        {customerDetails.User.name.slice(0, 8)} Programs
                                    </Link>
                                </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers/${params.customerId}/programs/${params.programId}`}>
                                        Program goals
                                    </Link>
                                </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers/${params.customerId}/programs/${params.programId}/goals/${params.goalId}`}>
                                        Target sessions
                                    </Link>
                                </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />


                    </BreadcrumbList>
                </Breadcrumb>

                <div className='mt-8 px-4'>

                    <div className='h-full'>

                        <Card className='h-full space-y-6'>
                            <CardHeader>
                                <CardTitle>
                                    Target sessions
                                </CardTitle>
                            </CardHeader>
                            <div className='flex flex-col items-center'>
                                <CardContent>
                                    <ProgramGoalCalendar 
                                        goalId={params.goalId} 
                                        allSessions={allSessions ? allSessions?.Seance : []} 
                                        user={authUser.User}
                                    />
                                </CardContent>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page
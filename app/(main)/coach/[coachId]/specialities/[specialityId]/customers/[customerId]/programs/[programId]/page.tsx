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


import Link from 'next/link'
import { getCustomerDetails, getGoals } from '@/data'
import AddGoal from './_components/AddGoal'
import { get } from 'http'
import GoalList from './_components/GoalList'
import Donut from './_components/Donut'


type Props = {
    params: {
        coachId: string
        specialityId: string
        customerId: string
        programId: string
    }
}


const page = async({ params } : Props) => {

    const goals = await getGoals(params.programId)
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


                    </BreadcrumbList>
                </Breadcrumb>

                <main className='flex flex-1 gap-4 sm:px-6 sm:py-0 md:gap-8 flex-col'>

                    <div className='ml-auto flex items-center gap-2'>
                        <AddGoal programId={params.programId}/>
                    </div>

                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 mt-16 px-4'>
                        <Card className='h-full'>
                            <CardHeader>
                                <CardTitle>
                                    Program goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GoalList items={goals} params={params}/>
                            </CardContent>
                        </Card>
                        <Card className='h-full space-y-6 bg-card-foreground/40'>
                            <CardHeader>
                                <CardTitle>
                                    Program Dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Donut items={goals}/>
                            </CardContent>
                        </Card>
                    </div>

                </main>
            </div>
        </div>
    )
}

export default page
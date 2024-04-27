import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { getCurrentGuest, getCustomerDetails, getGoals } from '@/data'
import Unauthorized from '@/components/unauthorized'
import GoalsList from './_components/goal-list'
import Donut from './_components/Donut'

type Props = {
    params: {
        guestId: string
        specialityId: string
        programId: string
    }
}


const page = async ({ params } : Props) => {

    const authUser = await getCurrentGuest()
    if (!authUser) return <Unauthorized />


    const goals = await getGoals(params.programId)
    const CustomerDetails = await getCustomerDetails(authUser.id)


    return (
        <>
            <div className='flex justify-between p-4'>
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}`}>{CustomerDetails.User.name.slice(0,8)} Programs</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}/programs/${params.programId}`}>Program goals</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-16 px-4"> 
                <Card className='h-hull'>
                    <CardHeader>
                        <CardTitle>Program goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GoalsList items={goals} params={params} user={authUser.User}/>
                    </CardContent>
                
                </Card>
                <Card className="space-y-6 h-full bg-card-foreground/40">
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Donut items={goals}/>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default page
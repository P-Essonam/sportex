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
import ProgramGoalCalendar from '@/components/global/ProgramGoalCalendar'
import { getAllSessions, getCurrentGuest } from '@/data'
import Unauthorized from '@/components/unauthorized'


type Props = {
    params: {
        guestId: string
        specialityId: string
        programId: string
        goalId: string
    }
}



const page = async({ params } : Props) => {

    let allSessions = await getAllSessions(params.goalId)
    const CustomerDetails = await getCurrentGuest()

    if (!CustomerDetails || !CustomerDetails.User) return <Unauthorized />


    return (
        <>
            <div className='flex justify-between p-4'>
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>

                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}`}>{CustomerDetails?.User.name.slice(0,8)} Programs</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}/programs/${params.programId}`}>Program goals</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}/programs/${params.programId}/goals/${params.goalId}`}>Target sessions</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

            </div>
            <div className="mt-8 px-4"> 
                <Card className='h-full'>
                    <CardHeader>
                        <CardTitle>Target sessions</CardTitle>
                    </CardHeader>

                    <div className='flex flex-col items-center'>
                        <CardContent>
                            <ProgramGoalCalendar  
                                goalId={params.goalId}
                                allSessions={allSessions ? allSessions?.Seance : []} 
                                user={CustomerDetails.User}/>
                        </CardContent>
                    </div>
                
                </Card>

            </div>
        </>
    )
}

export default page
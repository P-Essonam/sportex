import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { getCustomerDetails, getSpecialityLogo } from '@/data'
import { STATUS } from '@prisma/client'
import AddProgram from '../_components/AddProgram'
import CoachProgramCard from '../_components/CoachProgramCard'

type Props = {
    params: {
        coachId: string
        specialityId: string
        customerId: string
    }
}


const page = async({ params } : Props) => {
    const customerDetails = await getCustomerDetails(params.customerId)
    const specialityLogo = await getSpecialityLogo(params.specialityId)


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


                    </BreadcrumbList>
                </Breadcrumb>

                <main className='flex flex-1 gap-4 sm:px-6 sm:py-0 md:gap-8 flex-col'>

                    <div className='ml-auto flex items-center gap-2'>
                        <AddProgram customerId={params.customerId}/>
                    </div>

                    <div>

                        <div className='grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            {
                                customerDetails.Program.map((item) => (
                                    <CoachProgramCard 
                                        key={item.id} 
                                        title={item.title}
                                        url={specialityLogo.logo}
                                        goalsLength={item.ProgramGoals.length}
                                        price={item.price}
                                        progress={item.ProgramGoals.length > 0 ? 
                                            Math.round((item.ProgramGoals.filter((goal) => goal.status===STATUS.DONE).length / item.ProgramGoals.length) * 100) 
                                            : 0
                                        }
                                        params={params}
                                        programId={item.id}
                
                                    />
                                ))
                            }
                        </div>

                        {
                            customerDetails.Program.length === 0 && (
                                <div className='text-center text-sm text-muted-foreground mt-10 w-full'>
                                    No program found
                                </div>

                            )
                        }
                    </div>


                </main>
            </div>
        </div>
    )
}

export default page
import React from 'react'


import {
    Card,
    CardDescription,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card'
import Unauthorized from '@/components/unauthorized'
import { getCurrentCoach, getCustomers, getProgression, getRevenue, getSpecialityWithCustomers } from '@/data'
import { Activity, DollarSign, Users } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import TremorBar from '@/components/global/tremor-bar'


const page = async() => {

    const authUser = await getCurrentCoach()
    if(!authUser) return <Unauthorized />

    const revenue = await getRevenue()
    const customers = await getCustomers()
    const progressGoal = await getProgression()
    const data = await getSpecialityWithCustomers()

    return (
        <div className="flex h-full w-full flex-col">
        
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">${revenue}</div>
                <p className="text-xs text-muted-foreground">
                    Total revenue for this speciality
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+{customers}</div>
                <p className="text-xs text-muted-foreground">
                    Total customers for this speciality
                </p>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Speciality goal</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold space-y-2">
                    <Progress
                        className="h-4 bg-secondary"
                        value={customers / progressGoal * 100}
                    />
                    <p className="font-medium flex justify-between w-full items-center">
                        <span>{customers}/{progressGoal}</span>
                        <span>{customers === progressGoal ? <Badge>Goal reached</Badge> : null}</span>
                    </p>
                </div>
                <p className="text-xs text-muted-foreground">
                    Speciality goal progression
                </p>
                </CardContent>
            </Card>
            </div>
            <div className="bg-card-foreground/40">
                <TremorBar data={data} />
            </div>
        </main>
        </div>
    )
}

export default page
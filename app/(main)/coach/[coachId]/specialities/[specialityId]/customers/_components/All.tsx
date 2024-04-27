import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getAllCustomers } from '@/data'
import { TabsContent } from '@/components/ui/tabs'
import { columns } from './columns'
import { DataTable } from './data-table'

type Props = {
    params: {
        coachId: string
        specialityId: string
    }

}
const All = async({ params } : Props) => {

    const allCustomers = await getAllCustomers()
    const data = allCustomers.map(customer => {
        return {
            id: customer.id,
            email: customer.User.email,
            name: customer.User.name,
            status: customer.status,
            createdAt: customer.createdAt.toLocaleDateString(),
            coachId: params.coachId,
            specialityId: params.specialityId
        }
    })

    return (
        <TabsContent value="all">
            <Card>
                <CardHeader>
                    <CardTitle>All customers</CardTitle>
                    <CardDescription>Manage all customers for this speciality</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data}/>
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default All
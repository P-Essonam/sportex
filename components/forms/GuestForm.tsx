
"use client";
import React, { useState } from 'react'


import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { format } from "date-fns"

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction,AlertDialogTrigger, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../ui/alert-dialog'
import { GuestCustomerSchema } from '@/schemas';
import { Customer, User } from '@prisma/client';
import UploadObjectBucket from '../global/s3-upload-file';
import { deleteAccount, updateCustomer, updateUser } from '@/data';
import { Textarea } from '../ui/textarea';



type Props = {  
    customer: Customer
}
  
const GuestForm = ({ customer } : Props) => {


    const router = useRouter()


    const form = useForm<z.infer<typeof GuestCustomerSchema>>({
        mode: "onChange",
        resolver: zodResolver(GuestCustomerSchema),
        defaultValues: {
            age: customer.age.toLocaleString(),
            background: customer.background,
            weight: customer.weight.toLocaleString(),
            size: customer.size.toLocaleString(),
            sex: customer.sex,
        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof GuestCustomerSchema>) => {
        try {
 
            await updateCustomer(values)
            router.refresh()
            toast.success("Data updated successfully")
        } catch (error) {
            toast.error("Error updating data")
        }
    }



    return (

        <Card className="w-full mt-4">
        <CardHeader>
            <CardTitle>User details</CardTitle>
            <CardDescription>
                Let&apos;s update your account settings.
            </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >

            <FormField
                disabled={isLoading}
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={"customer age"}
                            {...field}
                            type='number'
                            value={parseInt(field.value)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                disabled={isLoading}
                control={form.control}
                name="sex"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className='z-[300]'>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
    

            <FormField
                disabled={isLoading}
                control={form.control}
                name="weight"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={"customer weight"}
                            {...field}
                            type='number'  
                            value={parseInt(field.value)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                disabled={isLoading}
                control={form.control}
                name="size"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={"customer size"}
                            {...field}
                            type='number'
                            value={parseFloat(field.value)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        

            <FormField
                disabled={isLoading}
                control={form.control}
                name="background"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Background</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={"customer background"}
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        A brief background about you.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />



            <Button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? <Loading /> : "Save"}
            </Button>
            </form>
        </Form>

        </CardContent>
        </Card>

    )
}

export default GuestForm
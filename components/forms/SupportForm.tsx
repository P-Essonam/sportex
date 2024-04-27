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

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { toast } from 'sonner'
import {  User } from '@prisma/client'
import { Textarea } from '../ui/textarea';
import { SupportSchema } from '@/schemas';
import { sendRequestToSupport } from '@/data';



type Props = {
    user: User
}

const SupportForm = ({ user } : Props) => {

    const router = useRouter()


    const form = useForm<z.infer<typeof SupportSchema>>({
        mode: "onChange",
        resolver: zodResolver(SupportSchema),
        defaultValues: {
            email: user.email,
            name: user.name,
            message: ''
        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof SupportSchema>) => {
        try {
 
            await sendRequestToSupport(values.email, values.name, values.message)
            router.refresh()
            toast.success("Request sent successfully")
        } catch (error) {
            toast.error("Error sending request to support")
        }
    }


    return (
        <>
            <Card className="w-full mt-4">
            <CardHeader>
                <CardTitle>Request details</CardTitle>
                <CardDescription>
                    Let&apos;s send a new request to our support.
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    readOnly
                                    {...field}
                                    type='email'
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}                            
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="resize-none"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />



                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <Loading /> : "Send"}
                </Button>
                </form>
            </Form>

            </CardContent>
            </Card>
        </>
    )
}

export default SupportForm
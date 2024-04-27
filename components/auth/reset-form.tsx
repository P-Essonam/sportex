"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetSchema } from '@/schemas'


import {
    Card,
    CardHeader,
    CardFooter,
    CardDescription,
    CardTitle,
    CardContent
} from '@/components/ui/card'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage

} from '@/components/ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import BackButton from './back-button'
import FormSuccess from '../global/form-success'
import FormError from '../global/form-error'
import { reset } from '@/data/auth/reset'

const ResetForm = () => {

    const [error , setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ''
        }
    })



    const onSubmit = (data: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            reset(data)
                .then((response) => {
                    if(response.error){
                        setError(response.error)
                    }
                    if(response.success) {
                        setSuccess(response.success)
                    }
                })
                .catch(() => setError("An error occurred"))
        })
    }


    return (
        <Card>  

            <CardHeader>
                <CardTitle className='text-2xl'>Forgot your password?</CardTitle>
                <CardDescription>Enter your email below to reset your password</CardDescription>

            </CardHeader>

            <CardContent className='space-y-4'>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField 
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type='email'
                                            disabled={isPending}
                                            placeholder='Enter your email'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            type='submit'
                            disabled={isPending}
                            className='w-full'

                        >
                            Send reset email
                        </Button>

                    </form>
                </Form>

            </CardContent>

            <CardFooter>
                <BackButton href={'/auth/sign-in'} label={'Back to Login'} />
            </CardFooter>
        </Card>
    )
}

export default ResetForm
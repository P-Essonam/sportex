"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TwoFactorSchema } from '@/schemas'


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

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from '@/components/ui/input-otp'


import { Button } from '../ui/button'
import BackButton from './back-button'
import FormSuccess from '../global/form-success'
import FormError from '../global/form-error'
import { newVerification } from '@/data/auth/new-verification'

const NewVerificationForm = () => {

    const [error , setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof TwoFactorSchema>>({
        resolver: zodResolver(TwoFactorSchema),
        defaultValues: {
            code: ''
        }
    })


    const onSubmit = (data: z.infer<typeof TwoFactorSchema>) => {
        setError('')
        setSuccess('')

        startTransition(() => {
            newVerification(data)
                .then((response) => {
                    if(response.error) {
                        form.reset()
                        setError(response.error)
                    }

                    if(response.success) {
                        form.reset()
                        setSuccess(response.success)
                    }
                })
                .catch(() => setError('An error occurred. Please try again'))
        })
    }


    return (
        <Card>  

            <CardHeader>
                <CardTitle className='text-2xl'>Confirm your email</CardTitle>
                <CardDescription>Enter your OTP code below to verify your email</CardDescription>

            </CardHeader>

            <CardContent className='space-y-4'>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField 
                            name='code'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button
                            type='submit'
                            disabled={isPending}
                            className='w-full'

                        >
                            Confirm
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

export default NewVerificationForm
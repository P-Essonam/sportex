"use client"


import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema } from '@/schemas'


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
import { register } from '@/data/auth/register'
import { redirect } from 'next/navigation'
import FormError from '../global/form-error'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const RegisterForm = () => {

    const [error, setError] = useState<string | undefined>("")
    const [ isPending, startTransition ] = useTransition()
    const [ showTwoFactor, setShowTwoFactor ] = useState(false)


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })


    const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
        setError('')

        startTransition(()=> {
            register(data)
                .then((response) => {
                    if (response.error) {
                        form.reset()
                        setError(response.error)
                    }

                    if(response.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch((error) => {
                    setError('An error occurred')
                })

        })
    }

    if (showTwoFactor) {
        return redirect('/auth/new-verification');
    }

    const onClick = (provider: 'google') => {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT})
    }

    return (
        <Card>  

            <CardHeader>
                <CardTitle className='text-2xl'>Sign up</CardTitle>
                <CardDescription>Enter your informations below to create an account</CardDescription>

            </CardHeader>

            <CardContent className='space-y-4'>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField 
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isPending}
                                            placeholder='Enter your full name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormField 
                            name='password'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type='password'
                                            disabled={isPending}
                                            placeholder='Enter your password'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormError message={error} />
                        <Button
                            type='submit'
                            disabled={isPending}
                            className='w-full'

                        >
                            Create your account
                        </Button>

                    </form>
                </Form>

                <Button
                    variant={'outline'}
                    className='w-full'
                    onClick={() => onClick("google")}
                >
                    Login with Google
                </Button>

                <div className='mt-4 text-center text-sm'>
                    Already have an account?{' '}
                    <Link href={'/auth/sign-in'} className='underline'>
                        Sign in
                    </Link>
                </div>

            </CardContent>

        </Card>
    )
}

export default RegisterForm
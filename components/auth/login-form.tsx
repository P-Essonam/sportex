"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'


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
import { redirect, useSearchParams } from 'next/navigation'
import FormError from '../global/form-error'
import { login } from '@/data/auth/login'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'



const LoginForm = () => {


    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')
    const [error, setError] = useState<string | undefined>("")
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked"
        ? "Email already in use with different account"
        : ""

    const [ isPending, startTransition ] = useTransition()
    const [ showTwoFactor, setShowTwoFactor ] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })


    const onSubmit = (data: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(data, callbackUrl)
                .then((response) => {
                    if (response?.error){
                        form.reset()
                        setError(response?.error)
                    }

                    if(response?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                    
                })
                .catch(() => setError('An error occurred!'))
        })
    }

    if(showTwoFactor){
        return redirect('/auth/new-verification')
    }

    const onClick = (provider: 'google') => {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT || callbackUrl})
    }


    return (
        <Card>  

            <CardHeader>
                <CardTitle className='text-2xl'>Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>

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

                                    <Button
                                        size={'sm'}
                                        variant={'link'}
                                        asChild
                                        className='px-0 font-normal'
                                    >
                                        <Link href={'/auth/reset'}>
                                            Forgot your password?
                                        </Link>
                                    </Button>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormError message={error || urlError} />
                        <Button
                            type='submit'
                            disabled={isPending}
                            className='w-full'

                        >
                            Login
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
                    Don&apos;t have an account?{' '}
                    <Link href={'/auth/sign-up'} className='underline'>
                        Sign up
                    </Link>
                </div>

            </CardContent>

        </Card>
    )
}

export default LoginForm
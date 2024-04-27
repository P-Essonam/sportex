"use client"
import React from 'react'

import * as z from 'zod'

import {
    Form,
    FormControl,
    FormField,
    FormDescription,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"

import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/hooks/use-modal-provider'
import { CustomerSchema } from '@/schemas'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import Loading from '../global/loading'
import { 
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { createNewCustomer } from '@/data'




const CreateCustomerForm = () => {

    const { setClose } = useModal()
    const form  = useForm<z.infer<typeof CustomerSchema>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            age: '',
            Weight: '',
            size: '',
            background: '',
            sex: ''
        }
    })

    const router = useRouter()
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof CustomerSchema>) => {
        try {
            await createNewCustomer(data)
            router.refresh()
            toast.success('Speciality created')
            setClose()
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        }
    }


    return (
        <Card className='w-full mt-4'>
            <CardHeader>
                <CardTitle>Customer details</CardTitle>
                <CardDescription>Let&apos;s create a new customer for this speciality. You can edit later from the settings tab.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >   
                        <div className='flex sm:flex-row flex-col justify-between sm:space-x-4'>
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter the name of the customer'
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
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter the email of the customer'
                                                {...field}
                                                type='email'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex sm:flex-row flex-col justify-between sm:space-x-4'>
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='age'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter the age of the customer'
                                                {...field}
                                                type='number'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='sex'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sex</FormLabel>
                                       
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />       
                                                    </SelectTrigger>

                                                </FormControl>
                                                <SelectContent className='z-[300]'>
                                                    <SelectItem value='Male'>Male</SelectItem>
                                                    <SelectItem value='Female'>Female</SelectItem>
                                                </SelectContent>

                                            </Select>
                                       
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex sm:flex-row flex-col justify-between sm:space-x-4'>
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='Weight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter the weight of the customer'
                                                {...field}
                                                type='number'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='size'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                       
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter the size of the customer'
                                                    {...field}
                                                    type='number'
                                                />
                                            </FormControl>
                                    
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    
                                        <FormControl>
                                            <Input
                                                placeholder='Enter the password of the customer'
                                                {...field}
                                                type='password'
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief background of the customer
                                        </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
 
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='background'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background</FormLabel>
                                    
                                        <FormControl>
                                            <Textarea
                                                placeholder='Enter the background of the customer'
                                                {...field}
                                                className='resize-none'
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief background of the customer
                                        </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
 

                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            { isLoading ? <Loading /> : "Add customer" }
                        </Button>


                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateCustomerForm
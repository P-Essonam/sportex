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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProgramSchema } from '@/schemas'
import { Input } from '../ui/input'
import Loading from '../global/loading'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from "date-fns"
import { cn } from '@/lib/utils'
import { useModal } from '@/hooks/use-modal-provider'
import { CreateProgram } from '@/data'


type Props = {
    customerId: string
}


const CreateProgramForm = ({ customerId } : Props) => {


    const { setClose } = useModal()
    const form  = useForm<z.infer<typeof ProgramSchema>>({
        resolver: zodResolver(ProgramSchema),
        defaultValues: {
            title: '',
            description: '',
            price: '',
            start: undefined,
            end: undefined,
        }
    })

    const router = useRouter()
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof ProgramSchema>) => {
        try {
    
            await CreateProgram({...data,customerId})
            router.refresh()
            toast.success('Program created')
            setClose()
        } catch (error) {
            console.error(error)
            toast.error(`Something went wrong`)
        }
    }

    return (
        <Card className='w-full mt-4'>
            <CardHeader>
                <CardTitle>Program details</CardTitle>
                <CardDescription>Let&apos;s create a new program for this customer. You can edit later from the settings tab.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >   
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input 
                                        placeholder='Enter the title of the program'
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
                            name='description' 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Enter the description of the program'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='price' 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Enter the price of the program'
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex sm:flex-row flex-col gap-4'>
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='start' 
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>Start</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 z-[300]" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={isLoading}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                disabled={isLoading}
                                control={form.control}
                                name='end' 
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>End</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 z-[300]" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={isLoading}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            { isLoading ? <Loading /> : "Save" }
                        </Button>


                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateProgramForm
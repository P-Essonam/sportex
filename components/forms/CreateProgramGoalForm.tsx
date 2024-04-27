"use client"
import React from 'react'


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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProgramGoalSchema } from '@/schemas'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { cn } from '@/lib/utils'
import { Calendar } from '../ui/calendar'
import { toast } from 'sonner'
import { createProgramGoal, updateProgramGoal } from '@/data'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { STATUS } from '@prisma/client'
import { useModal } from '@/hooks/use-modal-provider'
  



type Props = {
    programId: string
}



const CreateProgramGoalForm = ({ programId } : Props) => {

  const router = useRouter()
  const { setClose, data } = useModal()

  const form = useForm<z.infer<typeof ProgramGoalSchema>>({
      mode: "onChange",
      resolver: zodResolver(ProgramGoalSchema),
      defaultValues: {
          description: data.Goal?.description || '',
          start: data.Goal?.start || undefined,
          end: data.Goal?.end || undefined,
          status: data.Goal?.status || STATUS.PENDING
      }
  })
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof ProgramGoalSchema>) => {
      try {
          data.Goal?.id ? 
          await updateProgramGoal({...values, goalId: data.Goal.id}) 
          : await createProgramGoal({...values, programId})
          
          router.refresh()
          data.Goal?.id ? toast.success("Goal updated") : toast.success("Goal created")
          setClose()
      } catch (error) {
          data.Goal?.id ? toast.error("Failed to update goal") : toast.error("Failed to create goal")
      }
  }


  return (
    <Card className="w-full mt-4">
        <CardHeader>
            <CardTitle>Details of program objective</CardTitle>
            <CardDescription>
                Let&apos;s create a new objective for this program. You can edit later from the settings tab.
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={"This is ..."}
                                {...field}
                                className='resize-none'
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />


            <div className="flex sm:flex-row gap-4 flex-col">
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Start</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "flex w-full pl-3 text-left font-normal",
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
                                mode='single'
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
                    name="end"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>End</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "flex w-full  pl-3 text-left font-normal",
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
                                mode='single'
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

            <FormField
                disabled={isLoading}
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status to display" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className='z-[300]'>
                        <SelectItem value={STATUS.PENDING}>{STATUS.PENDING}</SelectItem>
                        <SelectItem value={STATUS.INPROGRESS}>{STATUS.INPROGRESS}</SelectItem>
                        <SelectItem value={STATUS.DONE}>{STATUS.DONE}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />


            <Button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? <Loading /> : "Create Program"}
            </Button>
            </form>
        </Form>

        </CardContent>
    </Card>
    )
}

export default CreateProgramGoalForm
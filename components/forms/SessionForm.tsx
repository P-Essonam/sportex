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
import { SessionSchema } from '@/schemas'
import { STATUS, User } from '@prisma/client'
import { AlertDialog, AlertDialogAction,AlertDialogTrigger, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../ui/alert-dialog'
import { useModal } from '@/hooks/use-modal-provider'
import { createNewSession, deleteSession } from '@/data'



type Props = {

    goalId: string
    day: Date
    user: User
}


const SessionForm = ({ goalId, day, user } : Props) => {

    const router = useRouter()
    const { setClose, data } = useModal()
    const [deletingSession, setDeletingSession] = useState(false)


    const form = useForm<z.infer<typeof SessionSchema>>({
        mode: "onChange",
        resolver: zodResolver(SessionSchema),
        defaultValues: {
            date: data.Seance?.date || day,
            time: data.Seance?.time || '',
            status: data.Seance?.status || STATUS.PENDING
        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof SessionSchema>) => {
        try {
 
            await createNewSession({ ...values, goalId: goalId})
            router.refresh()
            toast.success("Session created successfully")
            setClose()
        } catch (error) {
            toast.error("Error creating session")
        }
    }

    const handleDeleteSession = async () => {
        try {
            if (!data.Seance) {
                return
            }
            setDeletingSession(true)
            await deleteSession(data.Seance.id)
            toast.success("Session deleted successfully")
            router.refresh()
            setClose()
        } catch (error) {
            toast.error("Error deleting session")
        } finally {
            setDeletingSession(false)
        }
    }

    return (
        <AlertDialog>
            <Card className="w-full mt-4">
            <CardHeader>
                <CardTitle>Session details</CardTitle>
                <CardDescription>
                    Let&apos;s create a new session for this program goal. You can edit later from the settings tab.
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
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input
                                    readOnly
                                    {...field}
                                    value={format(day, 'PPPP')}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={"session time"}
                                    {...field}
                                    type="time"
                                    className='w-full'
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

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



                {
                    user.role === "COACH" && (  
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loading /> : "Save session"}
                        </Button>
                    )
                }
                </form>
            </Form>


            {user.role === "COACH" && data.Seance?.id && (
            <div className="flex max-xl:flex-col items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger zone</div>
              </div>
              <div className="text-muted-foreground">
                This action cannot be undone. This will permanently delete this goal and remove your data related from our servers.
              </div>
              <AlertDialogTrigger
                disabled={isLoading}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingSession ? <Loading /> :  'Delete goal'}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent className='z-[500]'>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete this goal and remove your data related from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingSession}
                onClick={handleDeleteSession}
              >
                {deletingSession ? <Loading /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
            </CardContent>
            </Card>

        </AlertDialog>
    )
}

export default SessionForm
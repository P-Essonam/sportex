
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
import { SettingsSchema } from '@/schemas';
import { User } from '@prisma/client';
import UploadObjectBucket from '../global/s3-upload-file';
import { deleteAccount, updateUser } from '@/data';
import { logOut } from '@/data/auth/logout';



type Props = {  
    user: User
}
  
const SettingsForm = ({ user } : Props) => {


    const router = useRouter()
    const [deletingAccount, setDeletingAccount] = useState(false)


    const form = useForm<z.infer<typeof SettingsSchema>>({
        mode: "onChange",
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || "",
        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
        try {
 
            await updateUser({...values, id: user.id})
            router.refresh()
            toast.success("User updated successfully")
        } catch (error) {
            toast.error("Error updating user")
        }
    }

    const handleDeleteAccount = async () => {
        try {
            setDeletingAccount(true)
            await deleteAccount(user.id)
            await logOut()
            toast.success("Account deleted successfully")
            router.refresh()
        } catch (error) {
            toast.error("Error deleting account")
        } finally {
            setDeletingAccount(false)
        }
    }


    return (
        <AlertDialog>
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
                            name="image"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your profile image</FormLabel>
                                
                                    <FormControl>
                
                                    <UploadObjectBucket
                                        accept={ {"image/*": []} }
                                        maxSize={1024 * 1024 * 4}
                                        acceptName="Image"
                                        showErrorMessage="Invalid file type. Please select an image with the correct size"
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                    
                                    </FormControl>
                            
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    readOnly
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
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    readOnly
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
                    {isLoading ? <Loading /> : "Save"}
                </Button>
                </form>
            </Form>


            {user.role === "COACH" && (
            <div className="flex max-xl:flex-col items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger zone</div>
              </div>
              <div className="text-muted-foreground">
                This action cannot be undone. This will permanently delete your account and remove your data related from our servers like customers, dashboard etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAccount ? <Loading /> :  'Delete account'}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent className='z-[500]'>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete your account and remove your data related from our servers like customers, dashboard etc.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
              >
                {deletingAccount ? <Loading /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
            </CardContent>
            </Card>

        </AlertDialog>
    )
}

export default SettingsForm
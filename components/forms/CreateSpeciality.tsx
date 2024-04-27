"use client";
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpecialitySchema } from '@/schemas';
import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import UploadObjectBucket from '../global/s3-upload-file';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createSpeciality } from '@/data';
import { useModal } from '@/hooks/use-modal-provider';

type Props = {
    isRedirect? : boolean
}

const CreateSpeciality = ({ isRedirect } : Props) => {

  const {setClose} = useModal()
    const form = useForm<z.infer<typeof SpecialitySchema>>({
      mode: "onChange",
      resolver: zodResolver(SpecialitySchema),
      defaultValues: {
          name: "",
          goal: "",
          logo: ""
      }
    })
    const router = useRouter()

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof SpecialitySchema>) => {
      try {
        await createSpeciality(values)
        router.refresh()
        toast.success('Speciality added successfully')
        isRedirect && setClose()
        isRedirect && router.replace(`/check`)
      } catch (error) {
        console.log(error)
        toast.error('could not add a new speciality')
      }
    };


    
    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Specialty details</CardTitle>
          <CardDescription>
              Let&apos;s create a new speciality. You can edit later from the settings tab.
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
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add image</FormLabel>
                    
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Speciality name"}
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
                  name="goal"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Goal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"5"}
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>
                        How many customers would you like to have in this speciality?
                      </FormDescription>
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

        </CardContent>
      </Card>
    )
}

export default CreateSpeciality
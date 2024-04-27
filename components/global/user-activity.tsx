"use client"
import React, { use, useEffect, useState } from 'react'


import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Speciality, User } from '@prisma/client';

import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-provider';
import { updateCurrentSpeciality } from '@/data';
import CustomModal from '../ui/custom-modal';
import CreateSpeciality from '../forms/CreateSpeciality';


type Props = {
    user: User
    speciality: Speciality[]
}


const UserActivity = ({ user,speciality } : Props) => {

    const logo = speciality.find((item) => item.id === user.currentSpeciality)?.logo
    const [image, setImage] = useState(logo || '');

    const { setOpen } = useModal()
    const router = useRouter()

    useEffect(() => {
      if (!logo) return;
      const signedUrl = cloudfrontSignedUrl({
          url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + logo,
          privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
          keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
          dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      });
      setImage(signedUrl)
    }, [logo])

    return (
        <div className='md:mx-4'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="justify-between"
                    >
                        <div className='flex space-x-2 items-center'>
                            <Avatar className='max-h-[30px] max-w-[30px]'>
                                <AvatarImage src={image}/>
                                <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{speciality.find((item) => item.id === user.currentSpeciality)?.name}</span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-4 mx-4 space-y-2">

                    {
                        speciality.map((item) => (
                            <div 
                                key={item.id} 
                                className='flex space-x-2 p-3 items-center hover:bg-accent cursor-pointer bg-background/60'
                                onClick={async() => {
                                    if (item.id === user.currentSpeciality) return;
                                    await updateCurrentSpeciality(item.id)
                                    window.location.reload()
                                    return router.replace(`/check`)
                                }}
                            >
                                {
                                    item.id === user.currentSpeciality && (         
                                        <Check className='h-4 w-4' />
                                    )
                                }
                                <span>{item.name}</span>
                            </div>
                        ))
                    }
                    {
                        user.role === 'COACH' && (
                            <Button
                                className='w-full space-x-2 mt-6' 
                                onClick={() => setOpen(
                                <CustomModal
                                    title="Add Speciality"
                                    subheading='Add a new speciality to your profile.'
                                >
                                    <CreateSpeciality  isRedirect={true}/>
                                </CustomModal>
                                )}
                            >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Speciality
                                </span>
                            </Button>
                        )
                    }        
                        
          
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default UserActivity
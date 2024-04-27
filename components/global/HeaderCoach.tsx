"use client"
import React, { useEffect, useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'
import { Speciality, User } from '@prisma/client'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { logOut } from '@/data/auth/logout'
import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import UserActivity from './user-activity'

type Props = {
    params: {
        coachId: string
        specialityId: string
    }
    user: User
    speciality: Speciality[]
}

const HeaderCoach = ({ params, user, speciality } : Props) => {

    const [image, setImage] = useState(user.image || '')
    useEffect(() => {
        if(!user.image || user.image.startsWith('https')) return

        const signedUrl = cloudfrontSignedUrl({
            url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + user.image,
            privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
            keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        });
        setImage(signedUrl)
    }, [user.image])


  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background
    px-4 md:px-6 z-[100]'>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5
        md:text-sm lg:gap-6">

            <UserActivity user={user} speciality={speciality} />

            <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}`}
            className='hover:text-foreground'>
                Dashboard
            </Link>
            <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers`}
            className='hover:text-foreground text-muted-foreground'>
                Customers
            </Link>
            <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/settings`}
            className='hover:text-foreground text-muted-foreground'>
                Settings
            </Link>
        </nav>

        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    className='shrink-0 md:hidden'
                >
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Toggle navigation menu</span>
                </Button>

            </SheetTrigger>

            <SheetContent side={'left'}>
                <nav className='grid gap-6 text-lg font-medium py-10'>
                    
                    <UserActivity user={user} speciality={speciality} />

                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}`}
                    className='hover:text-foreground'>
                        Dashboard
                    </Link>
                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers`}
                    className='hover:text-foreground text-muted-foreground'>
                        Customers
                    </Link>
                    <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/settings`}
                    className='hover:text-foreground text-muted-foreground'>
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>

        <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
            <div className='ml-auto flex-initial'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='rounded-full'>
                            <Avatar className='max-h-[30px] max-w-[30px]'>
                                <AvatarImage src={image} alt={user.name} />
                                <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>
                            Account
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link 
                                href={`/coach/${params.coachId}/specialities/${params.specialityId}/settings`}
                                className='w-full'
                            >
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link 
                                href={`/coach/${params.coachId}/specialities/${params.specialityId}/settings`}
                                className='w-full'
                            >
                                Support
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={ async() => {
                                await logOut()
                            }}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
  )
}

export default HeaderCoach
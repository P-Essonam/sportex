"use client"
import React, { useEffect, useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Menu} from 'lucide-react'
import Link from 'next/link'
import UserActivity from './user-activity'
import { Speciality, User } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { logOut } from '@/data/auth/logout'

type Props = {
    params: {
        guestId: string,
        specialityId: string
    }
    user: User
    speciality: Speciality[]
}

const HeaderGuest = ({ params,user,speciality } : Props) => {

    const [image, setImage] = useState(user.image || '');

    useEffect(() => {
      if (!user.image || user.image.startsWith('https')) return;
      const signedUrl = cloudfrontSignedUrl({
          url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + user.image,
          privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
          keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
          dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      });
      setImage(signedUrl)
    }, [user.image])
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[100]">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">

                <UserActivity user={user} speciality={speciality}/>


                <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}`} className="hover:text-foreground">
                    Programs
                </Link>
                <Link
                    href={`/guest/${params.guestId}/specialities/${params.specialityId}/settings`}
                    className="text-muted-foreground hover:text-foreground"
                    >
                    Settings
                </Link>
            </nav>
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium py-10">

                <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}`}>
                    Programs
                </Link>


                <Link
                    href={`/guest/${params.guestId}/specialities/${params.specialityId}/settings`}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Settings
                </Link>

                
                <UserActivity user={user} speciality={speciality}/>
                
        
                </nav>
            </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className='ml-auto  flex-initial'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className='max-h-[30px] max-w-[30px]'>
                            <AvatarImage src={image}/>
                            <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        <Link href={`/guest/${params.guestId}/speciality/${params.specialityId}/settings`} className='w-full'>
                            Settings
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                            await logOut()
                            }
                        }
                        className='hover:cursor-pointer w-full'
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

export default HeaderGuest
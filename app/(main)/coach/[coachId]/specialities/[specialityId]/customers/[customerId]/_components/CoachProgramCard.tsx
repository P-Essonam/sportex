import React from 'react'


import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { ProgramProgress } from '@/components/global/program-progress';

type Props = {
    title: string,
    url: string,
    goalsLength: number,
    price: number,
    progress: number,
    programId: string
    params: {
        coachId: string
        specialityId: string
        customerId: string
    }
}


const CoachProgramCard = ({ 
    title, 
    url, 
    goalsLength, 
    price, 
    progress, 
    programId, 
    params
 } : Props) => {

  
    const signedUrl = cloudfrontSignedUrl({
        url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + url,
        privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
        keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    });

    return (
        <Link href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers/${params.customerId}/programs/${programId}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 bg-card text-card-foreground cursor-pointer">
                <div className='relative w-full aspect-video rounded-md overflow-hidden'>
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={signedUrl}
                    />
                </div>
                <div className='flex flex-col pt-2'>
                      
                    <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
                        {title}
                    </div>

                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-muted-foreground">
                            { goalsLength } { goalsLength === 1 ? 'goal' : 'goals' }
                        </div>
                    </div>

                    {
                        progress !== null ? (
                            <ProgramProgress
                                variant={progress === 100 ? 'success' : 'default'}
                                size="sm"
                                value={progress}
                             />
                        ) : (
                            <p className='text-md md:text-sm font-medium text-slate-700'>
                                {formatPrice(price)}
                            </p>
                        )
                    }
                </div>
            </div>
        </Link>
    )
}

export default CoachProgramCard
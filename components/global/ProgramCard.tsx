import Image from 'next/image'
import React from 'react'

import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { formatPrice } from '@/lib/format';
import { ProgramProgress } from './program-progress';
import Link from 'next/link';

type Props = {
    title: string
    url: string
    goalsLength: number
    price: number
    progress: number
    programId: string
    params: {
        guestId: string
        specialityId: string
    }
}

const ProgramCard = ({ title,url,price, progress,goalsLength,params,programId } : Props) => {

    const signedUrl = cloudfrontSignedUrl({
        url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + url,
        privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
        keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    });

    return (
        <Link href={`/guest/${params.guestId}/specialities/${params.specialityId}/programs/${programId}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-card text-card-foreground cursor-pointer">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={signedUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                    {title}
                </div>
                <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                    <div className="flex items-center gap-x-1 text-muted-foreground">
                    <span>
                        { goalsLength } {goalsLength === 1 ? 'Goal' : 'Goals' }
                    </span>
                    </div>
                </div>
                { progress !== null ? (
                    <ProgramProgress
                        variant={progress === 100 ? "success" : "default"}
                        size="sm"
                        value={progress}
                    />
                ) : (
                    <p className="text-md md:text-sm font-medium text-slate-700">
                    {formatPrice(price)}
                    </p>
                )}
                </div>
            </div>
        </Link>

    )
}

export default ProgramCard
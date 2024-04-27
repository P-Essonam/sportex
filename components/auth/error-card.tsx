import React from 'react'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'


import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent
} from '@/components/ui/card'
import BackButton from './back-button'


const ErrorCard = () => {
    return (
        <Card>
            
            <CardHeader>
                <CardTitle className='text-2xl'>Oops ! Something went wrong!</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='w-full flex justify-center items-center'>
                    <ExclamationTriangleIcon className="text-destructive" />
                </div>
            </CardContent>

            <CardFooter>
                <BackButton href={'/auth/sign-in'} label={'Back to Login'} />
            </CardFooter>
        </Card>
    )
}

export default ErrorCard
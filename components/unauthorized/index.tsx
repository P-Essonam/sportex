"use client"

import React from 'react'


import { Button } from '../ui/button'
import Link from 'next/link'


const Unauthorized = () => {

  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">{`Unauthorized acccess!`}</h1>
      <p>{`Please contact support or your coach to get access`}</p>
      <Button
        variant={'ghost'}
        className="mt-4 p-2"
        asChild
      >
        <Link href="/check" className='underline decoration-solid'>
            {`Back to home`}
        </Link>
      </Button>
    </div>
  )
}

export default Unauthorized
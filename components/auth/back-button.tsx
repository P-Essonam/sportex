"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'


type BackButtonProps = {
    href: string
    label: string
}

const BackButton = ({ label, href } : BackButtonProps) => {
  return (
    <Button
        variant={'link'}
        className="font-normal w-full"
        size={'sm'}
        asChild
    >
        <Link href={href}>
            {label}
        </Link>

    </Button>
  )
}

export default BackButton
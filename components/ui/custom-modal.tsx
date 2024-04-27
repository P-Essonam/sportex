import React from 'react'


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog"
import { useModal } from '@/hooks/use-modal-provider'



type Props = {
    title: string
    subheading: string
    children: React.ReactNode
    defaultOpen?: boolean
}

const CustomModal = ({ children, defaultOpen, subheading, title } : Props) => {

    const { isOpen, setClose } = useModal()
    return (
        <Dialog
            open={isOpen || defaultOpen}
            onOpenChange={setClose}
        >
            <DialogContent className='overflow-auto max-h-[700px] z-[300] h-fit bg-card'>
                <DialogHeader className='pt-8 text-left'>
                    <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
                    <DialogDescription>
                        {subheading}
                    </DialogDescription>
                    {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CustomModal
"use client"
import Loading from '@/components/global/loading'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/ui/custom-modal'
import { useModal } from '@/hooks/use-modal-provider'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


type Props = {
    customerId: string
}
const DeleteCutomer = ({ customerId } : Props) => {
    const router = useRouter()
    const { setOpen, setClose } = useModal()
    const [isLoading, setIsLoading] = useState(false)
    const deleteUSer = async () => {
        try {

            //WIP: This is where the delete function should be called
            setIsLoading(true)
            setClose()
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <button
            onClick={() => setOpen(
                <CustomModal
                 title="Are you absolutely sure?"
                 subheading='This action cannot be undone. This will permanently delete the customer.'
                >
                    <Button
                        onClick={setClose}
                        variant='outline'
                        className='w-ful'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={deleteUSer}
                        className='bg-destructive text-white w-full'
                        disabled={isLoading}
                    >
                        { isLoading ? <Loading /> : 'Delete'}
                    </Button>
                </CustomModal>
            )}
        >
            Delete
        </button>
    )
}

export default DeleteCutomer
"use client"
import React from 'react'


import { Button } from '@/components/ui/button'
import CustomModal from '@/components/ui/custom-modal'
import { useModal } from '@/hooks/use-modal-provider'
import { PlusCircle } from 'lucide-react'
import CreateProgramGoalForm from '@/components/forms/CreateProgramGoalForm'


type Props = {
    programId: string
}



const AddGoal = ({ programId } : Props) => {

    const { setOpen } = useModal()
    
    return (
        <Button
            size={'sm'}
            className='h-8 gap-1'
            onClick={() => setOpen(
                <CustomModal
                    title='Add Customer'
                    subheading='Add a new customer to your list'
                >
                    <CreateProgramGoalForm programId={programId}/>
                </CustomModal>
            )}
        >
            <PlusCircle className='w-3.5 h-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Goal
            </span>
        </Button>
    )
}

export default AddGoal
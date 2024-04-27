"use client"
import CreateCustomerForm from '@/components/forms/CreateCustomerForm'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/ui/custom-modal'
import { useModal } from '@/hooks/use-modal-provider'
import { PlusCircle } from 'lucide-react'
import React from 'react'

const AddCustomer = () => {

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
                    <CreateCustomerForm />
                </CustomModal>
            )}
        >
            <PlusCircle className='w-3.5 h-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Customer
            </span>
        </Button>
    )
}

export default AddCustomer
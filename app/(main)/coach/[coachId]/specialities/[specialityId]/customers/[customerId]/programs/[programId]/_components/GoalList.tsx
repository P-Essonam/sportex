"use client"
import { useModal } from '@/hooks/use-modal-provider'
import { ProgramGoals, STATUS } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogAction
} from "@/components/ui/alert-dialog"
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import CustomModal from '@/components/ui/custom-modal'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Loading from '@/components/global/loading'
import { toast } from 'sonner'
import { updatedGoalPositions } from '@/data'
import CreateProgramGoalForm from '@/components/forms/CreateProgramGoalForm'

interface Props {
    items: ProgramGoals[]
    params: {
        coachId: string
        specialityId: string
        customerId: string
        programId: string
    }

}

const GoalList = ({ items, params } : Props) => {

    const [isMounted, setIsMounted] = useState(false)
    const [goals, setGoals] = useState(items)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { setOpen } = useModal()

    useEffect(() => {
        setIsMounted(true)
    }, [])


    useEffect(() => {
        setGoals(items)
    }, [items])


    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return

        const items = Array.from(goals)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)

        const updatedGoal = items.slice(startIndex, endIndex + 1)

        setGoals(items)

        const bulkUpdatedData = updatedGoal.map((item) => ({
            id: item.id,
            position: items.findIndex((goal) => goal.id === item.id)
        }))

        onReoder(bulkUpdatedData)
    }


    const onReoder = async(updatedData: { id: string, position: number }[]) => {
        try {   
            await updatedGoalPositions(updatedData)
            toast.success('Goals reordered successfully')
            router.refresh()
        } catch (error) {
            toast.error('An error occured while reordering the goals')
        }
    }

    const deleteGoal = async(id: string) => {
        //WIP : your code here
    }


    if(!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='goal'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {goals.map((item, index) => (
                            <Draggable 
                                key={item.id} 
                                draggableId={item.id} 
                                index={index}
                            >
                                {(provided) => {
                                    return (
                                        <div
                                            className='p-4 w-full'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <AlertDialog>

                                                <div
                                                    className="p-4 border rounded-md space-y-4"
                                                  {...provided.dragHandleProps}
                                                >

                                                <div className='flex justify-between w-full items-start' >
                                                    <p className='text-md max-w-md'>{item.description}</p>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <MoreVertical  className='w-5 h-5' />
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem>
                                                                <Link 
                                                                    className='w-full'
                                                                    href={`/coach/${params.coachId}/specialities/${params.specialityId}/customers/${params.customerId}/programs/${params.programId}/goals/${item.id}`}
                                                                >
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setOpen(
                                                                        <CustomModal
                                                                        title='Edit goal'
                                                                        subheading='Edit the goal '
                                                                        >
                                                                            <CreateProgramGoalForm programId={params.programId} />

                                                                        </CustomModal>,

                                                                        { Goal: item || undefined  }
                                                                    )
                                                                }}
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <AlertDialogTrigger>
                                                                    Delete
                                                                </AlertDialogTrigger>
                                                            </DropdownMenuItem>

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                    
                                                <div className='flex justify-between border border-card'>
                                                    <div className='flex space-x-4'>
                                                        <span className='text-xs text-card-foreground/70'>{format(item.start, 'PPPP')}</span>
                                                        <span>__</span>
                                                        <span className='text-xs text-card-foreground/70'>{format(item.end, 'PPPP')}</span>
                                                    </div>
                                                    <div className='flex flex-col space-y-4'>
                                                        <span
                                                            className={cn(`font-semibold`,
                                                                item.status === STATUS.INPROGRESS && 'text-yellow-500',
                                                                item.status === STATUS.DONE && 'text-emerald-500',
                                                            )}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                

                                                <AlertDialogContent className='z-[500]'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete goal</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this goal?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => deleteGoal(item.id)}
                                                        >
                                                            {isLoading ? <Loading /> : 'Delete'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>

                                                </div>

                                            </AlertDialog>
                                        </div>
                                    )
                                }}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </DragDropContext>
    )
}

export default GoalList
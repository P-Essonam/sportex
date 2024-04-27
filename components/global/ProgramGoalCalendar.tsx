"use client";
import React, { useState } from 'react'


import { Seance, User } from '@prisma/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal-provider';
import { MyCalendar } from '../ui/MyCalendar';
import CustomModal from '../ui/custom-modal';
import SessionForm from '../forms/SessionForm';
import { getGoalSession } from '@/data';


type Props = {
    goalId: string
    allSessions: Seance[] 
    user: User 
}

export default function ProgramGoalCalendar({ goalId, allSessions, user } : Props) {


    const { setOpen } = useModal()
    const selectedDays = (
        allSessions.map((session) => (session.date)) 
    ) 
    const formatDay = (date: Date) => {
        const day = format(date, 'dd');
        let status = '';
      
        allSessions.forEach((session) => {
          if (new Date(session.date).getTime() === date.getTime()) {
            status = session.status;
          }
        });
      
        return (
            <div className={cn(
                `w-full h-full items-start p-4 flex flex-col justify-between`,
                status === 'DONE' && 'bg-emerald-500',
                status === 'INPROGRESS' && 'bg-yellow-500',
            )}>
                <div className="">{day}</div>
                <div className='text-accent-foreground font-bold hidden xl:flex'>{status}</div>
            </div>
        )
    };

    return (
        <MyCalendar
            mode="single"
            className="rounded-md border "
            onDayClick={async(day) => {
                    const data = await getGoalSession(day)
                    setOpen(
                        <CustomModal 
                            title="Add session" 
                            subheading='Add a session to the goal'
                        >
                            <SessionForm goalId={goalId} day={day} user={user}/>
                        </CustomModal>,
                        { Seance: data || undefined}
                    )
                }
            }   
            allSessions={allSessions}
            selected={selectedDays as unknown as Date} 
            formatters={{
                formatDay
            }}
        />
    )
    
}
"use client";

import { ProgramGoals, STATUS, User } from "@prisma/client";
import { useEffect, useState } from "react";


import { format } from 'date-fns'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreVertical } from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-provider";



interface goalListProps {
  items: ProgramGoals[];
  params: {
    guestId: string;
    specialityId: string;
    programId: string;
  }
  user: User
};

const GoalsList = ({ items, params,user } : goalListProps) => {

    const [isMounted, setIsMounted] = useState(false);
    const [goals, setgoals] = useState(items);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { setOpen } = useModal();


    useEffect(() => {
      setgoals(items);
    }, [items]);


    return (
        <div>
          {goals.map((goal, index) => (
              <div className="p-4 w-full" key={index}>
                <div
                  className="p-4 border rounded-md space-y-4"
                >
                    <div className="flex justify-between w-full items-start">
                        <p className='text-md max-w-md'>{goal.description}</p>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                              <MoreVertical className="w-5 h-5"/>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link  
                                className="w-full"
                                href={`/guest/${params.guestId}/specialities/${params.specialityId}/programs/${params.programId}/goals/${goal.id}`}>
                                View
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='flex justify-between border border-card'>
                        <div className='flex space-x-4'>
                            <span className='text-sm text-card-foreground/70'>{format(goal.start, 'PPPP')}</span>
                            <span>__</span>
                            <span className='text-sm  text-card-foreground/70'>{format(goal.end, 'PPPP')}</span>
                        </div>
                        <div className='flex flex-col space-y-4'>
                            <span className={cn(`font-semibold`,
                              goal.status === STATUS.INPROGRESS && 'text-yellow-500',
                              goal.status === STATUS.DONE && 'text-emerald-500',
                            )}>{goal.status}</span> 
                        </div>
                    </div>

                </div>
              </div>
            ))}
        </div>
    )
}

export default GoalsList
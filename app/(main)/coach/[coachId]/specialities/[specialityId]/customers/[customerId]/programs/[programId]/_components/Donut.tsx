"use client";

import React from 'react'
import { CustomTooltipProps, DonutChart, Legend } from '@tremor/react'
import { ProgramGoals } from '@prisma/client';


type Props = {
    items: ProgramGoals[];
}  


const Donut = ({ items } : Props) => {


    let pendingCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;

    items.forEach((item) => {
        if (item.status ===  'PENDING') {
            pendingCount++;
        } else if (item.status === 'INPROGRESS') {
            inProgressCount++;
        } else if (item.status === 'DONE') {
            doneCount++;
        }
    });

    const data = [
        { name: 'PENDING ', count: pendingCount },
        { name: 'IN PROGRESS ', count: inProgressCount },
        { name: 'DONE ', count: doneCount }
    ];

    const customTooltip = (props: CustomTooltipProps) => {
        const { payload, active } = props;
        if (!active || !payload) return null;
        const categoryPayload = payload?.[0];
        if (!categoryPayload) return null;
        return (
          <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
            <div className="flex flex-1 space-x-2.5">
              <div
                className={`flex w-1.5 flex-col bg-${categoryPayload?.color}-500 rounded`}
              />
              <div className="w-full">
                <div className="flex items-center justify-between space-x-8">
                  <p className="text-right text-tremor-content">
                    {categoryPayload.name}
                  </p>
                  <p className="whitespace-nowrap text-right font-medium text-tremor-content-emphasis">
                    {categoryPayload.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

    }
    

    return (
        <div className='flex w-full h-full justify-between items-center'>
            <DonutChart
                data={data}
                category="count"
                index="name"
                colors={['cyan', 'yellow', 'emerald']}
                className="flex-1 h-[300px]"
                animationDuration={2000}
                showAnimation={true}
                customTooltip={customTooltip}
                noDataText='No data available'
                />
         
            <Legend
            categories={['PENDING ', 'IN PROGRESS ', 'DONE']}
            colors={['cyan', 'yellow', 'emerald']}
            className="max-w-xs"
            />
        </div>
    )
}

export default Donut
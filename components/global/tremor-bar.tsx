import React from 'react'


import { BarChart } from '@tremor/react'


type TremorBarProps = {
    data: {
        speciality: string;
        customers: number;
    }[] | undefined;
};


const TremorBar = ({ data } : TremorBarProps) => {

  if (!data) return null

  const chartdata = data?.map((item) => {
      return {
          name: item.speciality,
          "Number of customers per speciality": item.customers,
      }
  })


  return (
    <BarChart
        className="text-sm stroke-primary"
        data={chartdata}
        index="name"
        categories={["Number of customers per speciality"]}
        colors={['primary']}
        yAxisWidth={30}
        noDataText='No data available'
    />
  )
}

export default TremorBar
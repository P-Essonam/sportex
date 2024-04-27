import HeaderLayout from '@/components/home/HeaderLayout'
import React from 'react'


type Props = {
    children: React.ReactNode
}


const layout = ({ children } : Props) => {
    return (
        <div>
            <HeaderLayout />
            {children}
        </div>
    )
}

export default layout
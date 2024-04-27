"use client"

import { Seance, ProgramGoals } from '@prisma/client'
import React, { FC, createContext, useContext, useEffect, useState } from 'react'


interface ModalProviderProps {
    children: React.ReactNode
}

export type ModalData = {
    Seance?: Seance
    Goal?: ProgramGoals
}


type ModalContextType = {
    data: ModalData
    isOpen: boolean
    setOpen: (modal: React.ReactNode, data?: ModalData) => void
    setClose: () => void
}


export const ModalContext = createContext<ModalContextType>({
    data: {},
    isOpen: false,
    setOpen: (modal: React.ReactNode, data?: ModalData) => {},
    setClose: () => {}
})


const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<ModalData>({})
    const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const setOpen = async (
        modal: React.ReactNode,
        data?: ModalData
    ) => {
        if(modal){
            setData({...data} || {})
            setShowingModal(modal)
            setIsOpen(true)
        }
    }

    const setClose = () => {
        setIsOpen(false)
        setData({})
    }


    if(!isMounted) return null

    return (
        <ModalContext.Provider value={{ data, isOpen, setOpen, setClose}}>
            {children}
            {showingModal}
        </ModalContext.Provider>
    )
}

export default ModalProvider




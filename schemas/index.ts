import { STATUS, UserRole } from '@prisma/client'
import { Weight } from 'lucide-react'
import * as z from 'zod'



export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})


export const RegisterSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
})


export const ResetSchema = z.object({
    email: z.string().email()
})


export const TwoFactorSchema = z.object({
    code: z.string().length(6)
})


export const NewPasswordSchema = z.object({
    password: z.string().min(8)
})


export const SpecialitySchema = z.object({
    logo: z.string().min(1, {
        message: "Image is required"
    }),
    name: z.string().min(3),
    goal: z.string()
})


export const CustomerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Minimum 8 characters required",
    }),
    age: z.string(),
    Weight: z.string(),
    size: z.string(),
    background: z.string(),
    sex: z.string()
})


export const ProgramSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(3),
    price: z.string(),
    start: z.date(),
    end: z.date(),
})


export const ProgramGoalSchema = z.object({
    description: z.string().min(1),
    start: z.date(),
    end: z.date(),
    status: z.enum([STATUS.PENDING, STATUS.INPROGRESS, STATUS.DONE])
})


export const SessionSchema = z.object({
    date: z.date(),
    time: z.string(),
    status: z.enum([STATUS.PENDING, STATUS.INPROGRESS, STATUS.DONE])
})


export const SettingsSchema = z.object({
    name: z.string(),
    email: z.string().optional(),
    image: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.COACH, UserRole.GUEST])
})


export const SupportSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    message: z.string()
})


export const GuestCustomerSchema = z.object({
    age: z.string(),
    weight: z.string(),
    size: z.string(),
    background: z.string(),
    sex: z.string()
})

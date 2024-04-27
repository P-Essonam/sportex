"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserByEmail } from "./auth"
import bcrypt from 'bcryptjs'
import { CustomerStatus, STATUS, UserRole } from "@prisma/client"
import { Resend } from "resend"
import { custom } from "zod"





export const getCurrentUser = async () => {
    try {
        const user = await currentUser()
        if(!user || !user.email) throw new Error("User not found")

        const userData = await db.user.findUnique({
            where:{
                id: user.id
            },
            include: {
                Coach: true,
                Customer: true
            }
        })

        return userData
    } catch (error) {
        console.log("Error in getCurrentUser: ", error)
        throw new Error("Error in getCurrentUser")
    }
}



export const getSpeciality = async() => {
    try {
        const user = await getCurrentUser()

        if(!user || !user.currentSpeciality) throw new Error("User not found")

        return user.currentSpeciality
        
    } catch (error) {
        return null
    }
}


export const createSpeciality = async (
    data: { logo: string, name: string, goal: string}
) => {
    try {
        const user = await getCurrentUser()
        if(!user || !user.Coach) throw new Error("User not found")
        
        const speciality = await db.speciality.create({
            data: {
                ...data,
                goal: Number(data.goal),
                coachId: user.Coach.id
            }
        })

        const updateUser = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                currentSpeciality: speciality.id
            }
        })

        return speciality
    } catch (error) {
        console.log("Error in createSpeciality: ", error)
        throw new Error("Error in createSpeciality")
    }
}


export const getCurrentCoach = async () => {
    try {
        
        const user = await currentUser()
        if(!user || !user.email) throw new Error("User not found")

        const coach =  await db.coach.findUnique({
            where: {
                userId: user.id
            },
            include: {
                Speciality: true,
                User: true
            }
        })

        return coach
    } catch (error) {
        console.log("Error in getCurrentCoach: ", error)
        throw new Error("Error in getCurrentCoach")
    }
}


export const getCurrentGuest = async () => {
    try {
        
        const user = await currentUser()
        if(!user || !user.email) throw new Error("User not found")

        const guest =  await db.customer.findUnique({
            where: {
                userId: user.id
            },
            include: {
                Speciality: true,
                User: true,
                Program: {
                    include: {
                        ProgramGoals: true
                    }
                }
            }
        })

        return guest
    } catch (error) {
        console.log("Error in getCurrentGuest: ", error)
        throw new Error("Error in getCurrentGuest")
    }
}


export const createNewCustomer = async (
    data: {
        name: string,
        email: string,
        password: string,
        age: string,
        sex: string,
        background: string,
        size: string,
        Weight: string
    }
) => {

    try {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const existingUser = await getUserByEmail(data.email)

        if(existingUser) throw new Error("User already exists")
        
        const customer = await db.$transaction( async (db) => {
            const user = await getCurrentUser()
            if(!user || !user.currentSpeciality) throw new Error("User not found")

            const addUser = await db.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: hashedPassword,
                    role: UserRole.GUEST,
                    emailVerified: new Date(),
                    currentSpeciality: user.currentSpeciality
                }
            })

            const addCustomer = await db.customer.create({
                data: {
                    sex: data.sex,
                    age: parseInt(data.age),
                    weight:parseInt(data.Weight),
                    size: parseFloat(data.size),
                    background: data.background,
                    Speciality: {
                        connect: {
                            id: user.currentSpeciality
                        }
                    },
                    userId: addUser.id
                }
            })
            return addCustomer
        }, { maxWait: 5000 , timeout: 10000})

        return customer

    } catch (error) {
        console.log("Error in createNewCustomer: ", error)
        throw new Error("Error in createNewCustomer")
    }
}


export const updateCustomer = async (
    data: {
        age: string,
        background: string,
        weight: string,
        size: string,
    }
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")
        
            const customer = await db.customer.update({
                where: {
                    userId: user.id
                },
                data: {
                    age: parseInt(data.age),
                    background: data.background,
                    weight: parseInt(data.weight),
                    size: parseFloat(data.size)
                }
            })

            return customer
    } catch (error) {
        console.log('Error in updateCustomer: ', error)
        throw new Error('Error in updateCustomer')
    }
}


export const getAllCustomers = async () => {
    try {
        const user = await getCurrentUser()
        if(!user || !user.currentSpeciality || !user.Coach) throw new Error("User not found")

            const customers = await db.customer.findMany({
                where: {
                    Speciality: {
                        some: {
                            coachId: user.Coach.id,
                            id: user.currentSpeciality
                        }
                    }
                },
                include: {
                    User: true
                }
            })

            return customers
    } catch (error) {
        console.log("Error in getAllCustomers: ", error)
        throw new Error("Error in getAllCustomers")
    }
}


export const getAllActiveCustomers = async () => {
    try {
        const user = await getCurrentUser()
        if(!user || !user.currentSpeciality || !user.Coach) throw new Error("User not found")

            const customers = await db.customer.findMany({
                where: {
                    Speciality: {
                        some: {
                            coachId: user.Coach.id,
                            id: user.currentSpeciality

                        }
                    },
                    status: CustomerStatus.ACTIVE
                },
                include: {
                    User: true
                }
            })

            return customers
    } catch (error) {
        console.log("Error in getAllActiveCustomers: ", error)
        throw new Error("Error in getAllActiveCustomers")
    }
}


export const getAllArchivedCustomers = async () => {
    try {
        const user = await getCurrentUser()
        if(!user || !user.currentSpeciality || !user.Coach) throw new Error("User not found")

            const customers = await db.customer.findMany({
                where: {
                    Speciality: {
                        some: {
                            coachId: user.Coach.id,
                            id: user.currentSpeciality

                        }
                    },
                    status: CustomerStatus.INACTIVE
                },
                include: {
                    User: true
                }
            })

            return customers
    } catch (error) {
        console.log("Error in getAllActiveCustomers: ", error)
        throw new Error("Error in getAllActiveCustomers")
    }
}


export const getCustomerDetails = async (customerId: string) => {
    try {
        const authUser = await currentUser()
        if(!authUser) throw new Error("Access denied")

        const customerData = await db.customer.findUnique({
            where: {
                id: customerId
            },
            include: {
                User: true,
                Program: {
                    include: {
                        ProgramGoals: true
                    }
                }
            }
        })

        if(!customerData) throw new Error("Customer not found")

        return customerData

    } catch (error) {
        console.log("Error in getCustomerDetails: ", error)
        throw new Error("Error in getCustomerDetails")
    }
}


export const getSpecialityLogo = async (specialityId: string) => {
    try {
        const authUser = await currentUser()
        if(!authUser) throw new Error("Access denied")

        const logo = await db.speciality.findUniqueOrThrow({
            where: {
                id: specialityId
            },
            select: {
                logo: true
            
            }
        })

        return logo
    } catch (error) {
        console.log("Error in getSpecialityLogo: ", error)
        throw new Error("Error in getSpecialityLogo")
    }
}



export const CreateProgram = async (
    data: {
        title: string,
        description: string,
        price: string,
        start: Date,
        end: Date,
        customerId: string
    }
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")

        const program = await db.program.create({
            data: {
                title: data.title,
                description: data.description,
                customerId: data.customerId,
                start: data.start,
                end: data.end,
                price: parseFloat(data.price)
            }
        })

        return program
    } catch (error) {
        console.log("Error in CreateProgramForm: ", error)
        throw new Error("Error in CreateProgramForm")
    }
}


export const getGoals = async (programId: string) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")

        const goals = await db.programGoals.findMany({
            where: {
                ProgramId: programId
            },
            orderBy: {
                position: 'asc'
            }
        })

        return goals
    } catch (error) {
        console.log("Error in getGoals: ", error)
        throw new Error("Error in getGoals")
    }
}


export const updatedGoalPositions = async(
    updatedData: {
        id: string,
        position: number
    }[]
) => {
    try {
        
        const transaction = await db.$transaction(async(db) =>{
            try {
                for (const {id, position} of updatedData) {
                    const goal = await db.programGoals.update({
                        where: {
                            id: id
                        },
                        data: {
                            position: position
                        }
                    })

                    if(!goal) throw new Error("Failed to updated goal position")
                }
            } catch (error) {
                console.log("Error in updatedGoalPositions | Transaction: ", error)
            }
        }, {maxWait: 5000, timeout: 10000})

        return true

    } catch (error) {
        console.log('Error in updatedGoalPositions: ', error)
        throw new Error('Error in updatedGoalPositions')
    }
}



export const createProgramGoal = async (
    data: { 
        description: string,
        start: Date, 
        end: Date, 
        programId: string
    }
) => {
try {
    const user = await currentUser()
    if (!user) {
        throw new Error('Access denied!')
    }

    const lastGoal = await db.programGoals.findFirst({
        where: {
          ProgramId: data.programId,
        },
        orderBy: {
          position: 'desc',
        },
    });

    const position = lastGoal ? lastGoal.position + 1 : 1;

    const programGoal = await db.programGoals.create({
        data: {
            description: data.description,
            start: data.start,
            end: data.end,
            Program: {
                connect: {
                    id: data.programId
                }
            },
            position: position
        }
    });

    return programGoal
} catch (error) {
    console.log('🔴Error creating program', error)
    throw new Error('Could not create program')
}
}



export const updateProgramGoal = async (
    data: { 
        description: string,
        start: Date, 
        end: Date, 
        goalId: string
        status: STATUS
    }
) => {
try {
    const user = await currentUser()
    if (!user) {
        throw new Error('Access denied!')
    }

    const goal = await db.programGoals.update({
        where: {
            id: data.goalId
        },
        data: {
            description: data.description,
            start: data.start,
            end: data.end,
            status: data.status
        }
    });

    return goal
} catch (error) {
    console.log('🔴Error creating program', error)
    throw new Error('Could not create program')
}
}




export const getAllSessions = async (goalId: string) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")

        const sessions = db.programGoals.findUnique({
            where: {
                id: goalId
            },
            select: {
                Seance: true
            }
        })

        return sessions
    } catch (error) {
        console.log("Error in getAllSessions: ", error)
        throw new Error("Error in getAllSessions")
    }
}


export const getGoalSession = async (day: Date) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")
        
            const session = db.seance.findFirst({
                where: {
                    date: day
                }
            })

            return session
    } catch (error) {
        console.log("Error in getGoalSession: ", error)
        throw new Error("Error in getGoalSession")
    }
}


export const createNewSession = async(
    data: {
        date: Date,
        time: string,
        status: STATUS,
        goalId: string
    }
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")
        
            const session = db.seance.upsert({
                where: {
                    date: data.date
                },
                create: {
                    date: data.date,
                    time: data.time,
                    status: data.status,
                    ProgramGoals: {
                        connect: {
                            id: data.goalId
                        }
                    }
                },
                update: {
                    time: data.time,
                    status: data.status
                }
            })

            return session
    } catch (error) {
        console.log("Error in createNewSession: ", error)
        throw new Error("Error in createNewSession")
    }
}


export const deleteSession = async (sessionId: string) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")

        const session = db.seance.delete({
            where: {
                id: sessionId
            }
        })
        return session
    } catch (error) {
        console.log("Error in deleteSession: ", error)
        throw new Error('Error in deleteSession')
    }
}


export const updateUser = async (
    data: {
        id: string,
        name: string,
        image: string
    }
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error('Access denied!')

        const updatedUser = await db.user.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                image: data.image
            }
        })

        return updatedUser
    } catch (error) {
        console.log("Error in updateUser: ", error)
        throw new Error('Error in updateUser')
    }
}


export const deleteAccount = async(
    userId: string
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error('Access denied!')

        const deleteUser = await db.user.delete({
            where: {
                id: userId
            }
        })

        return deleteUser
    } catch (error) {
        console.log('Error in deleteAccount: ', error)
        throw new Error("Error in deleteAccount")
    }
}


export const updateCurrentSpeciality = async (
    specialityId: string
) => {
    try {
        const user = await currentUser()
        if(!user) throw new Error('Access denied!')

        const updatedUser = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                currentSpeciality: specialityId
            }
        })

        return updatedUser
    } catch (error) {
        console.log('Error in updateCurrentSpeciality: ', error)
        throw new Error('Error in updateCurrentSpeciality')
    }
}



export const getRevenue = async () => {

    try {
        const user = await getCurrentCoach()
        if(!user) throw new Error("User not found")

        if(!user.User.currentSpeciality) throw new Error("Speciality not found")

        const currentSpeciality = await db.speciality.findUnique({
            where: {
                id: user.User.currentSpeciality
            },
            select: {
                Customer: {
                    select: {
                        Program: {
                            select: {
                                price: true
                            }
                        }
                    }
                }
            }
        })

        if(!currentSpeciality) throw new Error("Speciality not found")
        
        const revenue = currentSpeciality.Customer.reduce((acc, customer) => {
            return acc + customer.Program.reduce((acc, program) => {
                return acc + program.price
            }, 0)
        }, 0)

        return revenue


    } catch (error) {
        console.log('Error in getRevenue: ', error)
        throw new Error("Error in getRevenue")
    }
}


export const getCustomers = async () => {
    try {
        const user = await getCurrentCoach()
        if(!user) throw new Error("Access denied")

            
        if(!user.User.currentSpeciality) throw new Error("Speciality not found")

        const currentSpeciality = await db.speciality.findUnique({
            where: {
                id: user.User.currentSpeciality
            },
            select: {
                Customer: true
            }
        })

        if(!currentSpeciality) throw new Error("Speciality not found")
        
        return currentSpeciality.Customer.length
    } catch (error) {
        console.log('Error in getCustomers: ', error)
        throw new Error("Error in getCustomers")
    }
}


export const getProgression = async () => {
    try {
        const user = await getCurrentCoach()
        if(!user) throw new Error("Access denied")
        
        if(!user.User.currentSpeciality) throw new Error("Speciality not found")
        
        const currentSpeciality = await db.speciality.findUnique({
            where: {
                id: user.User.currentSpeciality
            },
        }) 
        
        if(!currentSpeciality) throw new Error("Speciality not found")
        
        return currentSpeciality.goal

    } catch (error) {
        console.log('Error in getProgression: ', error)
        throw new Error("Error in getProgression")
    }
}



export const getSpecialityWithCustomers = async () => {
    try {
        const user = await currentUser()
        if(!user) throw new Error("Access denied")
        
        const data = await db.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                Coach: {
                    select: {
                        Speciality: {
                            include: {
                                Customer: true
                            }
                        }
                    }
                }
            }
        })

        return data?.Coach?.Speciality.map((item) => {
            return {
                speciality: item.name,
                customers: item.Customer.length
            }
        })
    } catch (error) {
        console.log('Error in getSpecialityWithCustomers: ', error)
        throw new Error('Error in getSpecialityWithCustomers')
    }
}



const resend = new Resend(process.env.RESEND_API_KEY);
export const sendRequestToSupport = async (
    email: string,
    name: string,
    message: string,
  ) => {
  
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.SUPPORT_EMAIL!,
      subject: "Request to support",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div>
                <div style="display: inline-block;">
                    <h1>
                      From: ${name} | ${email}
                    </h1>
                    <p>
                        ${message}
                    </p>
                </div>
            </div>
        </body>
      </html>`
    });
};
  
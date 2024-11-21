'use server'

import { auth } from "@/app/auth.config"
import prisma from "@/lib/prisma"

export const getPaginatedOrders = async () => {

    const session = await auth()

    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'No tienes permisos para realizar esta acción'
        }
    }

    const orders = await prisma.order.findMany({
        orderBy: {
            crateAt: 'desc'
        },
        include: {
            OrderAddress: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })

    return {
        ok: true,
        orders
    }
}
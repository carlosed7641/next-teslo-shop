'use server'

import { auth } from "@/app/auth.config"
import prisma from "@/lib/prisma"

export const getUsers = async () => {

    const session = await auth()

    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'No tienes permisos para realizar esta acción'
        }
    }

    const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return {
        ok: true,
        users
    }
}
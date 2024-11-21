'use server'

import type { Address } from "@/app/interfaces/address.interface"
import prisma from "@/lib/prisma"

export const setUserAddress = async (address: Address, userId: string) => {

    try {

        const newAddress = await createOrReplaceAddress(address, userId)

        return {
            ok: true,
            address: newAddress
        }

    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: 'No se pudo guardar la dirección'
        }
    }
}

export const removeAddress = async (userId: string) => {
    
        try {
    
            await prisma.userAddress.delete({
                where: { userId }
            })
    
            return {
                ok: true
            }
    
        } catch (error) {
            console.error(error)
            return {
                ok: false,
                message: 'No se pudo eliminar la dirección'
            }
        }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {

    try {

        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        })

        const addressData = {
            userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            city: address.city,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode
        }

        if (!storedAddress) {
            await prisma.userAddress.create({
                data: addressData
            })

            return addressData
        }

        const updatedAddress = await prisma.userAddress.update({
            where: { userId },
            data: addressData
        })

        return updatedAddress

    } catch (error) {
        console.error(error)
        throw new Error('No se pudo guardar la dirección')
    }
}
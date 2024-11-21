'use server'

import { PayPalOrderStatusResponse } from "@/app/interfaces/paypal.interface"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const paypalCheckPayment = async (paypalTransactionId: string) => {

    const authToken = await getPaypalBearerToken()

    if (!authToken) {
        return {
            ok: false,
            message: 'Error al obtener el token de autenticación'
        }
    }

    const resp = await verifyPayPalPayment(paypalTransactionId, authToken)

    if (!resp) {
        return {
            ok: false,
            message: 'Error al verificar el pago'
        }
    }

    const { status, purchase_units } = resp

    const { invoice_id: orderId } = purchase_units[0]

    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'El pago no ha sido completado'
        }
    }

    // Realizar la actualización de la orden en la base de datos
    try {

        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
              isPaid: true,
              paidAt: new Date(),
            }
        })
    } catch (error) {
        console.log('error', error)
        return {
            ok: false,
            message: 'Error al actualizar la orden'
        }
    }

    // Revalidar path
    revalidatePath(`/orders/${orderId}`)

    return {
        ok: true
    }

}

const getPaypalBearerToken = async () => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET
    const oatuh2Url = process.env.PAYPAL_OAUTH_URL ?? ''


    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8'
    ).toString('base64')

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic QWVwb29YLUxXejBIaDQtbFVnUmVwOUJCQkRiUjNjb2ZtY0ZMWUczdDEybnBZUmRPS0htenZiNkxVZ014bURUcU8wVDR6YkRKR1N2ZWItMXE6RUUzUmpFZHNKZkNKclZUbEhTVENmMDRnbnp0Y0pRbEJycGczbmg1RmQ2VGlWVnR2MjFtclAwOHkwbXphNGVCMGQ0WkR6WjlTSEtSaXo4TG4=");
    myHeaders.append(
        "Authorization",
        `Basic ${base64Token}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    try {

        const result = await fetch(oatuh2Url, {
            ...requestOptions,
            cache: 'no-store'
        }).then(res => res.json())
        return result.access_token

    } catch (error) {
        console.log('error', error)
        return null
    }

}

const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse | null> => {

    const paypalOrderurl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`

    const myHeaders = new Headers();
    myHeaders.append("Authorization",
        `Bearer ${bearerToken}`
    );

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    try {

        const result = await fetch(paypalOrderurl, {
            ...requestOptions,
            cache: 'no-store'
        }).then(res => res.json())
        return result

    } catch (error) {
        console.log('error', error)
        return null
    }

}
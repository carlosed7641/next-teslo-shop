'use server'

import { auth } from "@/app/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {

    const session = await auth();

    if (!session?.user) {
        return {
            ok: false,
            message: 'Debe estar autenticado'
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!order) throw 'No se encontró la orden'

        if (session.user.role === 'user') {
            if (order.userId !== session.user.id) {
               throw 'No tiene permisos para ver esta orden'
            }
        }

        return {
            ok: true,
            order
        }

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'Error al obtener la orden'
        }
    }
}
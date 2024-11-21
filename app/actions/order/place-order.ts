'use server'

import { auth } from "@/app/auth.config";
import type { Address } from "@/app/interfaces/address.interface";
import type { Size } from "@/app/interfaces/product.interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión activa'
        }
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    // Calcular los montos // encabezado
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

    // Los totales de tax, subtotal y total
    const { tax, subtotal, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error('Producto no encontrado')

        const subTotal = product.price * productQuantity

        totals.subtotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal * 1.15


        return totals

    }, { tax: 0, subtotal: 0, total: 0 })


    // Crear transacción en la base de datos
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            // 1. Actualizar el stock de los productos
            const updatedProductPromises = products.map((product) => {

                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0)

                if (productQuantity === 0) {
                    throw new Error('No tiene cantidad definida')
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductPromises)

            // Verificar valores negativos en la exsitencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} sin stock`)
                }
            })

            // 2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId,
                    ItemsInOrder: itemsInOrder,
                    subtotal,
                    tax,
                    total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            // Validar, si el price es cero, entonces, lanzar un error


            // 3. Crear la dirección de la orden
            const { country, ...restAddress } = address

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                updatedProducts,
                order,
                orderAddress
            }

        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }

    } catch (error) {
        return {
            ok: false,
            message: (error instanceof Error) ? error.message : 'Unknown error'
        }
    }

}
'use client'

import { useEffect, useState } from "react"
import { placeOrder } from "@/app/actions"
import { useAddressStore, useCartStore } from "@/app/store"
import { currencyFormat } from "@/app/utils"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const PlaceOrder = () => {

    const router = useRouter()
    const [loaded, setLoaded] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const address = useAddressStore(state => state.address)
    const { getSummary } = useCartStore();

    const { itemsInCart, subTotal, tax, total } = getSummary();
    const cart = useCartStore(state => state.cart)
    const { clearCart } = useCartStore()

    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true)

        const productsToOrder = cart.map(product => (
            {
                productId: product.id, 
                quantity: product.quantity,
                size: product.size
            }
        ))
        const response = await placeOrder(productsToOrder, address)

        if (!response.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(response.message!)
            return
        }

        // Everything went well
        clearCart()
        router.replace(`/orders/${response.order?.id}`)

    }

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7 h-fit">

            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-8">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>
                    {address.city}, {address.country}
                </p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>

            <div className="grid grid-cols-2">


                <span>No. Productos</span>
                <span className="text-right">{itemsInCart} artículos</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>


            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en &quot;Colorcar orden&quot;, aceptas nuestros <Link href="/terms" target="_blank" className="underline">términos y condiciones</Link> y nuestra <Link href="/privacy" target="_blank" className="underline">política de privacidad</Link>.
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>

                <button
                    onClick={onPlaceOrder}
                    className={
                        clsx(
                            {
                                'btn-primary': !isPlacingOrder,
                                'disabled': isPlacingOrder
                            }
                        )
                    }
                // href="/orders/123"
                >
                    Colorcar orden
                </button>
            </div>

        </div>
    )
}

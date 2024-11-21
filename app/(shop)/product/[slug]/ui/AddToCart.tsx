'use client'

import { useState } from 'react'
import { QuantitySelector, SizeSelector } from '@/app/components'
import type { CartProduct, Product, Size } from '@/app/interfaces/product.interfaces'
import { useCartStore } from '@/app/store'

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const { addProduct } = useCartStore()

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState<boolean>(false)

    const addToCart = () => {

        setPosted(true)

        if (!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity,
            size,
            image: product.images[0]
        }

        addProduct(cartProduct)
        setPosted(false)
        setQuantity(1)
        setSize(undefined)
    }

    return (
        <>
            {
            posted && !size &&
                <span className="mt-2 text-red-500 fade-in">
                    Debe seleccionar una talla
                </span>
            }

            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSelectSize={setSize}
            />
            <QuantitySelector 
                quantity={quantity}
                onChangeQuantity={setQuantity}
             />
            {/* Botón de añadir al carrito */}
            <button 
                onClick={addToCart}
                className="btn-primary my-5"
            >
                Agregar al carrito
            </button>
        </>
    )
}

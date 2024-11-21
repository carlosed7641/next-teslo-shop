'use client'

import { useEffect, useState } from "react"
import { useCartStore } from "@/app/store"
import { ProductImage, QuantitySelector } from "@/app/components"
import Link from "next/link"

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const { cart: productsInCart, updateProductQuantity, removeProduct } = useCartStore()

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) {
       return <p>Cargando...</p>
    }

    return (
        <>
            {
                productsInCart.map(product => (

                    <div key={`${product.slug} - ${product.size}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.title}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link 
                                className="hover:underline cursor-pointer"
                                href={`/product/${product.slug}`}>
                                {product.size} - {product.title}
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector
                                quantity={product.quantity}
                                onChangeQuantity={ quantity => updateProductQuantity(product, quantity)}
                             />

                            <button 
                                onClick={()=> removeProduct(product)}
                                className="underline mt-3">
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

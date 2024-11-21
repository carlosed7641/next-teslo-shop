'use client'
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/store";
import { currencyFormat } from "@/app/utils";


export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false);
    const { getSummary } = useCartStore();

    const { itemsInCart, subTotal, tax, total } = getSummary();

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart} artículos</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos (15%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
        </>
    )
}

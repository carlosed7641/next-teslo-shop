import { CartProduct } from "@/app/interfaces/product.interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface CartStore {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSummary: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }
    addProduct: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>()(

    persist(
        (set, get) => ({

            cart: [],

            // Methods
            clearCart() {
                set({ cart: [] })
            },
            getTotalItems() {
                const { cart } = get()
                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            getSummary() {
                const { cart } = get()

                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal, 0)
                const tax = subTotal * 0.15
                const total = subTotal + tax
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0)

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
            },
            addProduct: (product: CartProduct) => {

                const { cart } = get()

                // Revisar si el producto ya está en el carrito con la misma talla
                const productInCart = cart.some(
                    item => (item.id === product.id && item.size === product.size)
                )

                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return
                }

                // Si el producto ya está en el carrito, aumentar la cantidad
                const updatedCartProducts = cart.map(item => {

                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }

                    return item
                })

                set({ cart: updatedCartProducts })
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {

                const { cart } = get()

                const updatedCartProducts = cart.map(item => {

                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity
                        }
                    }

                    return item
                })

                set({ cart: updatedCartProducts })
            },
            removeProduct: (product: CartProduct) => {

                const { cart } = get()

                const updatedCartProducts = cart.filter(item => {
                    return item.id !== product.id || item.size !== product.size
                })

                set({ cart: updatedCartProducts })
            }

        }),
        {
            name: 'shopping-cart'
        }
    )

)
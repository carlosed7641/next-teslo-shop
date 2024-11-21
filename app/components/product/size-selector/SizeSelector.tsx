import type { Size } from '@/app/interfaces/product.interfaces'
import clsx from 'clsx'

interface Props {
    selectedSize?: Size
    availableSizes: Size[]
    onSelectSize: (size: Size) => void
}

export const SizeSelector = ({ selectedSize, availableSizes, onSelectSize }: Props) => {

    return (
        <div className="my-5">
            <h3 className="font-bold mb-4">Tallas disponibles</h3>
            <div className="flex">
                {
                    availableSizes.map(size => (
                        <button 
                            onClick={() => onSelectSize(size)}
                            key={size} className={
                            clsx(
                                "mx-2 hover:underline text-lg",
                                {
                                    "underline": selectedSize === size
                                }
                            )
                        }>
                            {size}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

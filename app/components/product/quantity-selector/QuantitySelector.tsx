'use client'

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onChangeQuantity: (value: number) => void;
}

export const QuantitySelector = ({ quantity, onChangeQuantity }: Props ) => {

  const onValueChange = (value: number) => {
    if (quantity + value < 1) return

    onChangeQuantity(quantity + value)

  }

  return (
    <div className="flex items-center">
        <button onClick={()=> onValueChange(-1)}>
            <IoRemoveCircleOutline size={30} />
        </button>
        <span className="w-20 px-5 bg-gray-100 text-center rounded">
            {quantity}
        </span>
        <button onClick={()=> onValueChange(1)}>
            <IoAddCircleOutline size={30} />
        </button>
    </div>
  )
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressStore {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
    }

    // Methods
    setAddress: (address: AddressStore['address']) => void;
}

export const useAddressStore = create<AddressStore>()(
    persist(
        (set) => ({
            address: {
                firstName: "",
                lastName: "",
                address: "",
                address2: "",
                postalCode: "",
                city: "",
                country: "",
                phone: "",
            },
            setAddress: (address) => set({ address })
        }),
        {
            name: "address-storage"
        }
    )
)
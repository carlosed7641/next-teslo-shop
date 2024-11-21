export const revalidate = 60 // 60 seconds

import { getPaginatedProductsWithImages } from "@/app/actions";
import { Pagination, ProductGrid, Title } from "@/app/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation"

interface Props {
  params: {
    gender: string
  },
  searchParams: {
    page?: string
  }
}


export default async function CategoryPage({ params, searchParams }: Props) {

  const { gender } = params;

  const page = searchParams.page ? Number(searchParams.page) : 1

  const { products, totalPages } = await getPaginatedProductsWithImages({ 
    page,
    gender: gender as Gender 
  })

  if (!products.length) {
    redirect(`gender/${gender}`)
  }

  const label: Record<string, string> = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos'
  }



  return (
    <>
      <Title
        title={`Artículos ${label[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
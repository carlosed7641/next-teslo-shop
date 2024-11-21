export const revalidate = 60

import { redirect } from "next/navigation";
import { getPaginatedProductsWithImages } from "../actions";
import { Pagination, ProductGrid, Title } from "../components";

interface Props {
  searchParams: {
    page?: number
  }
}

export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? Number(searchParams.page) : 1

  const { products, totalPages } = await getPaginatedProductsWithImages({ page })

  if (!products.length) {
    redirect("/")
  }

  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination
        totalPages={totalPages}
      />
    </>
  );
}

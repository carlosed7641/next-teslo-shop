export const revalidate = 604800 // 7 days

import type { Metadata } from 'next'
import { getProductBySlug } from "@/app/actions";
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/app/components";
import { titleFont } from "@/app/config/fonts";
import { notFound } from "next/navigation";
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug)
 
  // // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title,
    description: product?.description ?? "",
    openGraph: {
      title: product?.title,
      description: product?.description ?? "",
      images: [`/products/${product?.images[1]}`],
    }
  }
}

export default async function ProductPage({ params }: Props) {

  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/** Mobile Slideshow */}
        <ProductMobileSlideShow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />
        {/** Desktop Slideshow */}
        <ProductSlideShow
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
      </div>
      {/* Detalles */}
      <div className="col-span-1 px-5">

        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} /> 
        
        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-li">
          {product.description}
        </p>
      </div>
    </div>
  );
}
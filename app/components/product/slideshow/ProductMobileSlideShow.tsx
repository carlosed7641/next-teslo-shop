'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

interface Props {
    images: string[]
    title: string
    className?: string
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {

    return (
        <div className={className}>
            <Swiper
                style={{
                    width: '100vw',
                    height: '500px'
                }}
                pagination
                modules={[FreeMode, Autoplay, Pagination]}
                className="mySwiper2">
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <Image
                                src={`/products/${image}`}
                                alt={title}
                                width={600}
                                height={500}
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

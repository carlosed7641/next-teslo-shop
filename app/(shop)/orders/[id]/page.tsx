import Image from 'next/image';
// import { redirect } from 'next/navigation';
import { currencyFormat } from '@/app/utils/currencyFormat';

import { getOrderById } from '@/app/actions/order/ger-order-by-id';
import { OrderStatus, PayPalButton, Title } from '@/app/components';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    id: string
  }
}

export default async function OrdersPage({ params }: Props) {

  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect('/');
  }

  const address = order?.OrderAddress

  return (
    <div className="flex justify-center items-center mb-72">

      <div className="flex flex-col w-full">

        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={order!.isPaid} />
            {/* Items */}
            {
              order?.OrderItem.map(item => (

                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                  <Image
                    src={`/products/${item.product.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    alt={item.product.title}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{item.product.title}</p>
                    <p>${item.price} x {item.quantity}</p>
                    <p className="font-bold">Subtotal {currencyFormat(item.price * item.quantity)}</p>

                    <button className="underline mt-3">
                      Remover
                    </button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">

            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-8">
              <p className="text-xl">
                {address?.firstName} {address?.lastName}
              </p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>{address?.postalCode}</p>
              <p>
                {address?.city}, {address?.countryId}
              </p>
              <p>{address?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>

            <div className="grid grid-cols-2">

              <span>No. Productos</span>
              <span className="text-right">
                {order?.ItemsInOrder === 1 ? '1 producto' : `${order?.ItemsInOrder} productos`}s
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subtotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>


            </div>

            <div className="mt-5 mb-2 w-full">
              {
                order?.isPaid ? (
                  <OrderStatus isPaid={order.isPaid} />
                ) : <PayPalButton
                  amount={order!.total}
                  orderId={order!.id}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
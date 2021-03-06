import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { GET_ORDERS_BY_PK } from '@/graphql/orders';
import { createProtectedGraphQlClient } from '@/utils/graphql-instance';
import { Loader } from '@mantine/core';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import styles from './Order.module.css';
import { Clock, DiscountCheck } from 'tabler-icons-react';

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: order,
    isLoading,
    error
  } = useQuery(REACT_QUERY_KEYS.GET_ORDER_BY_PK, async () => {
    const res = await createProtectedGraphQlClient().request(GET_ORDERS_BY_PK, {
      id
    });
    return res?.orders_by_pk;
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (isLoading) {
    return <Loader variant="bars" />;
  }

  return (
    <div className="mx-auto my-5 min-h-full max-w-7xl bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto mb-5 max-w-2xl">
        <div className="mb-8">
          <h2 className="mb-3 font-medium">Order Details</h2>
          <div className=" grid gap-2">
            <p>
              <span className="text-gray-600">Order Id: </span>
              {order.id}
            </p>
            <p>
              <span className="text-gray-600">Status: </span>
              {order.status === 'PAID' ? (
                <>
                  <DiscountCheck
                    strokeWidth={1.5}
                    color={'#40bf64'}
                    className="inline-block"
                  />
                  {order.status}
                </>
              ) : (
                <>
                  <Clock
                    strokeWidth={1.5}
                    color={'#d1d279'}
                    className="inline-block"
                  />
                  {order.status}
                </>
              )}
            </p>
            <p>
              <span className="text-gray-600">Amount: </span>&#8377;
              {order.amount}
            </p>
            <p>
              <span className="text-gray-600">Ordered on: </span>
              {format(new Date(order.created_at), 'dd MMMM yyyy')}
            </p>
          </div>
        </div>
        <div>
          {order.order_items.map(
            ({ product: { id, price, image, title }, quantity }: any) => (
              <div
                key={id}
                className={`mb-8 grid items-center border-b-2 border-gray-100 pb-4 ${styles.cartGrid}`}
              >
                <div className="h-36 overflow-hidden">
                  <Link to={`/product/${id}`}>
                    <img
                      loading="lazy"
                      className="h-auto min-w-full object-cover"
                      src={image}
                      alt={title}
                    />
                  </Link>
                </div>
                <div>
                  <div className="mb-5 flex items-center gap-5">
                    <Link to={`/product/${id}`}>{title}</Link>
                  </div>
                  <div className="mb-5 flex items-center gap-5">
                    <span className="font-medium text-gray-500">
                      &#8377; {price} &#10060; {quantity}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-600">
                    &#8377; {Math.round(price * quantity * 100) / 100}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
        <div>
          <h2 className="mb-3 font-medium">Delivery Address</h2>
          <div className="grid gap-2">
            <p>{order.address.name}</p>
            <p>{order.address.mobile}</p>
            <p>{order.address.house}</p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

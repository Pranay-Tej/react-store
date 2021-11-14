import ProductRating from '@/components/ProductRating';
import useAxios from '@/hooks/useAxios';
import { ProductModel } from '@/models/product.model';
import { useCartStore } from '@/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

const ProductView = () => {
  const { findById, cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartStore();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  const { id } = useParams<{ id: string }>();

  const { execute, isLoading, data, errorMessage } = useAxios<ProductModel>();

  useEffect(() => {
    execute({ url: `https://fakestoreapi.com/products/${id}` });
    return () => {};
  }, []);

  useEffect(() => {
    setCartQuantity(findById(Number(id))?.quantity);
  }, [cart]);

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );
  if (errorMessage)
    return (
      <div className="grid min-h-screen place-items-center">{errorMessage}</div>
    );
  // const { image, title, price } = data;
  return (
    <div className="max-w-5xl min-h-full px-3 pt-10 mx-auto bg-white">
      {data && (
        <div className="p-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
          <div className="w-full h-96">
            <img
              className="object-contain h-full mx-auto"
              src={data.image}
              alt={data.title}
            />
          </div>
          <div className="pt-4">
            <div className="my-4 ">
              {cartQuantity ? (
                <div className="inline-flex items-center justify-center gap-3">
                  <IconButton
                    aria-label="decrease"
                    onClick={event => {
                      event.preventDefault();
                      decreaseQuantity(data.id, data.price);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <p className="text-lg font-semibold">{cartQuantity}</p>
                  <IconButton
                    aria-label="increase"
                    onClick={event => {
                      event.preventDefault();
                      increaseQuantity(data.id, data.price);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  endIcon={<LocalMallIcon />}
                  onClick={event => {
                    event.preventDefault();
                    addToCart({
                      itemId: data.id,
                      title: data.title,
                      price: data.price,
                      image: data.image,
                      quantity: 1
                    });
                  }}
                >
                  Add to bag
                </Button>
              )}
            </div>
            <p className="mb-4 text-lg">{data.title}</p>
            <ProductRating
              rating={data?.rating?.rate}
              count={data?.rating?.count}
            />
            <p className="mb-2 text-xl font-semibold text-gray-700">
              {data.price}
            </p>
            <p className="max-w-md text-base text-gray-600">
              {data.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;

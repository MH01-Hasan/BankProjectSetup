'use client';

import { addToCart, addToDamage, addToReturn, clearCart } from '@/redux/Slice/cartSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {

  const products = [
    { id: '1', name: 'Chocolate Cake', price: '250' },
    { id: '2', name: 'Vanilla Cupcake', price: '80' },
    { id: '3', name: 'Strawberry Donut', price: '60' },
    { id: '4', name: 'Lemon Tart', price: '120' },
    { id: '5', name: 'Red Velvet Slice', price: '200' },
    { id: '6', name: 'Cheese Danish', price: '100' },
    { id: '7', name: 'Black Forest Pastry', price: '220' },
    { id: '8', name: 'Fruit Trifle', price: '180' },
    { id: '9', name: 'Almond Brownie', price: '150' },
    { id: '10', name: 'Coffee Mousse', price: '170' },
  ];

   const dispatch = useDispatch();



  const Handelcard = (product) => {
  dispatch(addToCart(product));
  };


    const HandelDamage = (product) => {
    dispatch(addToDamage(product));
    };

    const Handelreturn = (product) => {
    dispatch(addToReturn(product));
    };

  const cart = useSelector((state) => state.cart);
  useEffect(() => {
  }, [cart, dispatch]);

  const cart_Item = cart?.cartItem;


  console.log(cart);

  const handelcleare = () => {
    dispatch(clearCart());
  }




  return (
    <div className="flex">
      {/* Left side - Product Info */}
      <div className="w-2/3 p-6">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Welcome to our bakery! We specialize in creating delicious and fresh baked goods made with love and the finest ingredients. Our team is passionate about baking and dedicated to providing you with the best treats.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Our Products</h2>
        <ul className="space-y-3">
          {products.map((product) => (
            <li key={product.id} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
              <span>{product.name} - ৳{product.price}</span>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() =>Handelcard(product)}
              >
                Add to Cart
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() =>HandelDamage(product)}
              >
                Damege
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() =>Handelreturn(product)}
              >
                Return
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Cart */}
      <div className="w-1/3 p-6 bg-gray-50 border-l border-gray-200 h-screen overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Cart</h2>
        {cart_Item.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <ul className="space-y-3">
            {cart_Item.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <span>{item.name} - ৳{item.price} x {item.cartQuantity}</span>
                <span className="font-bold">Total: ৳{(item.price * item.cartQuantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
       
      </div>
      <div>
        
      </div>

    <button onClick={handelcleare} className='bg-amber-600'>clear Cart</button>

    </div>
  );
};

export default Page;

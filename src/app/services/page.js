"use client";

import {
  getTotals,
  removeItem,
  updateQuantity
} from '@/redux/Slice/cartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiShoppingCart,
  FiTrash2
} from 'react-icons/fi';

const CartPage = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      
    }
  }, [cart, dispatch, hasMounted]);

  if (!hasMounted) return null;

  const cartItems = cart?.cartItem || [];
  const damageItems = cart?.damageItem || [];
  const returnItems = cart?.returnItem || [];

  const standaloneDamageItems = damageItems.filter(dItem =>
    !cartItems.some(cItem => cItem.id === dItem.id)
  );
  const standaloneReturnItems = returnItems.filter(rItem =>
    !cartItems.some(cItem => cItem.id === rItem.id)
  );

  // Calculate all totals
  const totalOrderedQuantity = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalOrderedValue = cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  
  const totalDamageQuantity = cartItems.reduce((sum, item) => sum + (item.damageQuantity || 0), 0) +
    standaloneDamageItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalDamageValue = cartItems.reduce((sum, item) => sum + (item.price * (item.damageQuantity || 0)), 0) +
    standaloneDamageItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const totalReturnQuantity = cartItems.reduce((sum, item) => sum + (item.marketReturnQuantity || 0), 0) +
    standaloneReturnItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalReturnValue = cartItems.reduce((sum, item) => sum + (item.price * (item.marketReturnQuantity || 0)), 0) +
    standaloneReturnItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const totalNetQuantity = cartItems.reduce((sum, item) => {
    const damage = item.damageQuantity || 0;
    const marketReturn = item.marketReturnQuantity || 0;
    return sum + Math.max(0, item.cartQuantity - damage - marketReturn);
  }, 0);
  
  const totalNetValue = cartItems.reduce((sum, item) => {
    const damage = item.damageQuantity || 0;
    const marketReturn = item.marketReturnQuantity || 0;
    const netQty = Math.max(0, item.cartQuantity - damage - marketReturn);
    return sum + (item.price * netQty);
  }, 0);

  const handleRemoveItem = (id) => {
    // dispatch(removeItem(id));
  };

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = item.cartQuantity + change;
    if (newQuantity > 0) {
      // dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 border-l border-gray-200 h-screen overflow-auto">
      <div className="flex items-center gap-2 mb-6">
        <FiShoppingCart className="text-2xl text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        <span className="ml-auto bg-indigo-600 text-white rounded-full px-2.5 py-1 text-xs font-medium">
          {cartItems.length} items
        </span>
      </div>

      {cartItems.length === 0 && standaloneDamageItems.length === 0 && standaloneReturnItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FiShoppingCart className="text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
           <table className="min-w-full divide-y divide-gray-200 text-sm">
  <thead className="bg-gray-50">
    <tr className="text-xs text-gray-500 uppercase tracking-wider">
      <th className="px-4 py-3 text-left font-medium">#</th>
      <th className="px-4 py-3 text-left font-medium">Item</th>
      <th className="px-4 py-3 text-center font-medium">Ordered</th>
      <th className="px-4 py-3 text-center font-medium">Damage</th>
      <th className="px-4 py-3 text-center font-medium">Return</th>
      <th className="px-4 py-3 text-center font-medium">Sale</th>
      <th className="px-4 py-3 text-center font-medium">Price</th>
      <th className="px-4 py-3 text-right font-medium">Total</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {/* Order Items */}
    {cartItems.map((item, index) => {
      const damage = item.damageQuantity || 0;
      const marketReturn = item.marketReturnQuantity || 0;
      const netQuantity = Math.max(0, item.cartQuantity - damage - marketReturn);
      const total = item.price * netQuantity;

      return (
        <tr key={`order-${item.id}`} className="hover:bg-gray-50 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap text-gray-500">{index + 1}</td>
          <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
          <td className="px-4 py-3 text-center">{item.cartQuantity}</td>
          <td className="px-4 py-3 text-center">{damage}</td>
          <td className="px-4 py-3 text-center">{marketReturn}</td>
          <td className="px-4 py-3 text-center">{netQuantity}</td>
          <td className="px-4 py-3 text-center">{item.price}</td>
          <td className="px-4 py-3 text-right font-bold text-indigo-600">{total}</td>
        </tr>
      );
    })}

    {/* Damage Items */}
    {standaloneDamageItems.map((damageItem, xxx) => (
      <tr key={`${damageItem.id}`} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-gray-500">D{xxx + 1}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{damageItem.name}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">{damageItem.quantity}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">{damageItem.price}</td>
        <td className="px-4 py-3 text-right font-bold text-indigo-600">{damageItem.price * damageItem.quantity}</td>
      </tr>
      
     
    ))}

    {standaloneReturnItems.map((returnItem, yyy) => (
      <tr key={`${returnItem.id}`} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-gray-500">R{yyy + 1}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{returnItem.name}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">{returnItem.quantity}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">{returnItem.price}</td>
        <td className="px-4 py-3 text-right font-bold text-indigo-600">{returnItem.price * returnItem.quantity}</td>
      </tr>
    ))}

  </tbody>
  
  {/* Table Footer with Totals */}
  <tfoot className="bg-gray-50 font-semibold">
    <tr>
      <td colSpan="2" className="px-4 py-3 text-right">Totals:</td>
      <td className="px-4 py-3 text-center  text-blue-600">
        {totalOrderedQuantity}
      </td>
      <td className="px-4 py-3 text-center  text-red-600">
        {totalDamageQuantity}
      </td>
      <td className="px-4 py-3 text-center  text-yellow-600">
        {totalReturnQuantity}
      </td>
      <td className="px-4 py-3 text-center">{totalNetQuantity}</td>
      <td className="px-4 py-3 text-center">-</td>
      <td className="px-4 py-3 text-right  text-indigo-600">
        ৳{totalOrderedValue + totalDamageValue + totalReturnValue}
      </td>
    </tr>
  </tfoot>
</table>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
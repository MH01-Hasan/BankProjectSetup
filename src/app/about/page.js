'use client';

import { useCategoriesQuery } from '@/redux/api/categoryApi';
import { useProductsQuery } from '@/redux/api/productApi';
import { useSalesmenQuery } from '@/redux/api/salesmaApi';
import { useDebounced } from '@/redux/hooks';
import { addToCart, addToDamage, addToReturn, clearCart,removeFromCart,updateCartItemQuantity } from '@/redux/Slice/cartSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {
  const query = {};
  const [page] = useState(1);
  const [size] = useState();
  const [sortBy] = useState("");
  const [sortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [error, setError] = useState(null); // Added error state

  const dispatch = useDispatch();
  
  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;

  if(category) {
    query["category"] = category;
  }

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { data, isLoading } = useProductsQuery({ ...query });
  const { data: categoryData } = useCategoriesQuery({});
  const { data:salesmans } = useSalesmenQuery({});

  const categories = categoryData?.categories || [];
  const products = data?.products || [];
  const salemandata = salesmans?.salesmen || [];

  useEffect(() => {
    // Initialize quantities with 1 for each product
    const initialQuantities = {};
    products.forEach(product => {
      initialQuantities[product.id] ; // Fixed: Initialize with 1 instead of undefined
    });
    setQuantities(initialQuantities);

   
  }, [products, salemandata]);

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    setQuantities(prev => ({
      ...prev,
      [productId]: numValue
    }));
  };


const handleAddToCart = (product) => {
  if (selectedSalesman === null) {
    setError("Please select a salesman before adding to cart.");
    return;
  }

  setError(null);
  dispatch(addToCart({
    ...product,
    quantity: quantities[product.id] || 1 // Fallback to 1 if undefined
  }));

  // Clear the quantity input for this product
  setQuantities(prev => ({
    ...prev,
    [product.id]: '' // Reset to 1 after adding to cart
  }));

}

  const cart = useSelector((state) => state.cart);
  const cart_Item = cart?.cartItem;

  const handleClear = () => {
    dispatch(clearCart());
  };
  const handlremoveformcart = (id) => {
    dispatch(removeFromCart(id));
  };



  return (
    <div className="flex flex-col mt-15 lg:flex-row gap-6 p-4 bg-gray-50 min-h-screen">
      {/* Left side - Product Info */}
      <div className="lg:w-2/3">
      
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
            <p className="mt-1 text-gray-600">Manage and add products to cart</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={category || ""}
                onChange={e => setCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
 {/* Error Message Display (Add this near the top) */}
        {error && (
          <div className="mb-4 p-3 bg-red-200 border-l-4 border-red-500 text-red-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
          {/* Products Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={quantities[product.id]  }
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)} 
                            className="w-16 p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Cart Summary */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Cart Summary</h2>
          
          {/* User Selection Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Salesman</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSalesman?.id || ''}
              onChange={(e) => {
                const selected = salemandata.find(s => s.id === e.target.value);
                setSelectedSalesman(selected || null);
              }}
            >
              <option value="">Select a salesman</option>
              {salemandata.map((salesman) => (
                <option key={salesman.id} value={salesman.id}>
                  {salesman.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Information Card */}
          {selectedSalesman && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Salesman Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span> {selectedSalesman.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Phone:</span> {selectedSalesman.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Address:</span> {selectedSalesman.address}
                  </span>
                </div>
              
              </div>
            </div>
          )}
          
          {/* Cart Items Table */}  
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cart_Item?.map(item => (
                  <tr key={item?.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     <input
                            type="number"
                           
                            value={item.cartQuantity}
                            onChange={(e) => {  
                              const newQuantity = parseInt(e.target.value)              
                              dispatch(updateCartItemQuantity({
                                id: item.id,
                                quantity: newQuantity
                              }));
                            }}
                            className="w-20 p-1 border border-gray-300 rounded-md text-center focus:ring-blue-500 focus:border-blue-500"
                          />
                    </td>
                          
                      
                 
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.price * item.cartQuantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handlremoveformcart(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cart_Item.length > 0 && (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleClear}
                className="w-full bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
'use client';

import { useCategoriesQuery } from '@/redux/api/categoryApi';
import { useProductsQuery } from '@/redux/api/productApi';
import { useDebounced } from '@/redux/hooks';
import { addToCart, addToDamage, addToReturn, clearCart } from '@/redux/Slice/cartSlice';
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
  const categories = categoryData?.categories || [];
  const products = data?.products || [];
  


  useEffect(() => {
    // Initialize quantities with 1 for each product
    const initialQuantities = {};
    products.forEach(product => {
      initialQuantities[product.id];
    });
    setQuantities(initialQuantities);
  }, []);

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value) ;
    setQuantities(prev => ({
      ...prev,
      [productId]: numValue < 1 ? 1 : numValue
    }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      ...product,
      quantity: quantities[product.id] || 1
    }));
  };

  // const handleDamage = (product) => {
  //   dispatch(addToDamage({
  //     ...product,
  //     quantity: quantities[product.id] || 1
  //   }));
  // };

  // const handleReturn = (product) => {
  //   dispatch(addToReturn({
  //     ...product,
  //     quantity: quantities[product.id] || 1
  //   }));
  // };

  const cart = useSelector((state) => state.cart);
  const cart_Item = cart?.cartItem;

  const handleClear = () => {
    dispatch(clearCart());
  };

  return (
    <div className="flex">
      {/* Left side - Product Info */}
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
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
                          value={quantities[product.id]}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)} 
                          className="w-16 p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Qty"
                />

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
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
      <div className="lg:w-1/3 mt-8 lg:mt-0">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h2>
          {cart_Item.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cart_Item.map(item => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.cartQuantity}</p>
                  </div>
                  <span className="text-sm text-gray-700">${item.price * item.cartQuantity}</span>
                </li>
              ))}
            </ul>
          )}
          {cart_Item.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleClear}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

 

 
  


export default Page;
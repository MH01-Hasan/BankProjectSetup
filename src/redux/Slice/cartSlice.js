import { createSlice } from "@reduxjs/toolkit";

const storedCartData = typeof localStorage !== 'undefined' ? localStorage.getItem("cartItem") : null;
const storedDamageData = typeof localStorage !== 'undefined' ? localStorage.getItem("damageItem") : null;
const storedReturnData = typeof localStorage !== 'undefined' ? localStorage.getItem("returnItem") : null;

const initialState = {
  cartItem: storedCartData?.length ? JSON.parse(storedCartData) : [],
  damageItem: storedDamageData?.length ? JSON.parse(storedDamageData) : [],
  returnItem: storedReturnData?.length ? JSON.parse(storedReturnData) : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  damageTotalQuantity: 0,
  returnTotalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add to main order list
    addToCart(state, action) {
      const itemIndex = state.cartItem.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.cartItem[itemIndex].cartQuantity += action.payload.quantity || 1;
      } else {
        const tempProduct = {
          ...action.payload,
          cartQuantity: action.payload.quantity || 1,
          damageQuantity: 0,
          marketReturnQuantity: 0
        };
        state.cartItem.push(tempProduct);
      }
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    // Add to damage list (with validation against order quantity)
    addToDamage(state, action) {
      const orderItemIndex = state.cartItem.findIndex(item => item.id === action.payload.id);
      
      if (orderItemIndex >= 0) {
        // Product exists in order list - update damage quantity
        const currentOrder = state.cartItem[orderItemIndex];
        const newDamageQty = (currentOrder.damageQuantity || 0) + (action.payload.quantity || 1);
        
        // Ensure damage doesn't exceed available quantity (order - returns)
        const maxPossible = currentOrder.cartQuantity - (currentOrder.marketReturnQuantity || 0);
        state.cartItem[orderItemIndex].damageQuantity = Math.min(newDamageQty, maxPossible);
      } else {
        // Product not in order list - add to separate damage items
        const damageItemIndex = state.damageItem.findIndex(item => item.id === action.payload.id);
        
        if (damageItemIndex >= 0) {
          state.damageItem[damageItemIndex].quantity += action.payload.quantity || 1;
        } else {
          state.damageItem.push({
            ...action.payload,
            quantity: action.payload.quantity || 1,
            isDamage: true
          });
        }
      }
      localStorage.setItem('damageItem', JSON.stringify(state.damageItem));
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    // Add to return list (with validation against order quantity)
    addToReturn(state, action) {
      const orderItemIndex = state.cartItem.findIndex(item => item.id === action.payload.id);
      
      if (orderItemIndex >= 0) {
        // Product exists in order list - update return quantity
        const currentOrder = state.cartItem[orderItemIndex];
        const newReturnQty = (currentOrder.marketReturnQuantity || 0) + (action.payload.quantity || 1);
        
        // Ensure return doesn't exceed available quantity (order - damage)
        const maxPossible = currentOrder.cartQuantity - (currentOrder.damageQuantity || 0);
        state.cartItem[orderItemIndex].marketReturnQuantity = Math.min(newReturnQty, maxPossible);
      } else {
        // Product not in order list - add to separate return items
        const returnItemIndex = state.returnItem.findIndex(item => item.id === action.payload.id);
        
        if (returnItemIndex >= 0) {
          state.returnItem[returnItemIndex].quantity += action.payload.quantity || 1;
        } else {
          state.returnItem.push({
            ...action.payload,
            quantity: action.payload.quantity || 1,
            isReturn: true
          });
        }
      }
      localStorage.setItem('returnItem', JSON.stringify(state.returnItem));
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    // Calculate all totals
    calculateTotals(state) {
      // Order totals
      const orderTotals = state.cartItem.reduce(
        (acc, item) => {
          const netQuantity = Math.max(0, 
            item.cartQuantity - (item.damageQuantity || 0) - (item.marketReturnQuantity || 0)
          );
          acc.totalQuantity += netQuantity;
          acc.totalAmount += netQuantity * item.price;
          return acc;
        },
        { totalQuantity: 0, totalAmount: 0 }
      );

      // Damage totals (both from cart items and separate damage items)
      const damageTotals = {
        fromOrders: state.cartItem.reduce((sum, item) => sum + (item.damageQuantity || 0), 0),
        fromDamageList: state.damageItem.reduce((sum, item) => sum + item.quantity, 0)
      };

      // Return totals (both from cart items and separate return items)
      const returnTotals = {
        fromOrders: state.cartItem.reduce((sum, item) => sum + (item.marketReturnQuantity || 0), 0),
        fromReturnList: state.returnItem.reduce((sum, item) => sum + item.quantity, 0)
      };

      state.cartTotalQuantity = orderTotals.totalQuantity;
      state.cartTotalAmount = orderTotals.totalAmount;
      state.damageTotalQuantity = damageTotals.fromOrders + damageTotals.fromDamageList;
      state.returnTotalQuantity = returnTotals.fromOrders + returnTotals.fromReturnList;
    },

    // Clear cart (reset all items and totals)
    clearCart(state) {
      state.cartItem = [];
      state.damageItem = [];
      state.returnItem = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.damageTotalQuantity = 0;
      state.returnTotalQuantity = 0;

      localStorage.removeItem('cartItem');
      localStorage.removeItem('damageItem');
      localStorage.removeItem('returnItem');
    },

    removeFromCart: (state, action) => {
  state.cartItem = state.cartItem.filter(item => item.id !== action.payload);
  localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
},

updateCartItemQuantity: (state, action) => {
  const { id, quantity } = action.payload;
  const item = state.cartItem.find(item => item.id === id);
  if (item) {
    item.cartQuantity = quantity;
  }
  localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
},

   

    // Other existing reducers can be added here...
  }
});

export const { 
  addToCart,
  addToDamage,
  addToReturn,
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
  calculateTotals
} = cartSlice.actions;

export default cartSlice.reducer;
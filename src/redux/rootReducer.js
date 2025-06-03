import { baseApi } from "./api/baseApi";
import cartReducer from './Slice/cartSlice';
import holdItemSlice from './Slice/holdItemSlice';

export const reducer = {
   [baseApi.reducerPath]: baseApi.reducer,
   cart: cartReducer,
   hold: holdItemSlice,
  
}




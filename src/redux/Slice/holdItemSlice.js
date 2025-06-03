import { createSlice } from "@reduxjs/toolkit";

const storedCartData =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("holditems")
    : null;

const initialState = {
  holditems: storedCartData?.length ? JSON.parse(storedCartData) : [],
};

const holdItemSlice = createSlice({
  name: "hold",
  initialState,
  reducers: {
    addToHold(state, action) {
      const tempProduct = { ...action.payload };
      state.holditems.push(tempProduct);
      localStorage.setItem("holditems", JSON.stringify(state.holditems));
    },

    DeleteHoldItem(state, action) {
      const nextCartItems = state.holditems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.holditems = nextCartItems;
      localStorage.setItem("holditems", JSON.stringify(state.holditems));
    },
  },
});

export const { addToHold, DeleteHoldItem } = holdItemSlice.actions;

export default holdItemSlice.reducer;

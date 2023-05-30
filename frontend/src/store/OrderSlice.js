import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  orderDetails: {},
  adminOrderList: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    loadOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrders: (state, action) => {
      state.orders = [...state.orders, action.payload];
    },

    loadOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    setAdminOrderList: (state, action) => {
      state.adminOrderList = action.payload;
    },
  },
});

export const { loadOrders, addOrders, loadOrderDetails, setAdminOrderList } =
  orderSlice.actions;

export default orderSlice.reducer;

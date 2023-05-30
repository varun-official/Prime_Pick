import { configureStore } from "@reduxjs/toolkit";
import products from "./ProductSlice";
import cart from "./CartSlice";
import user from "./UserSlice";
import order from "./OrderSlice";

export const store = configureStore({
  reducer: {
    products,
    cart,
    user,
    order,
  },
});

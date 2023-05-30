import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shipping: {
    address: "",
    city: "",
    pincode: "",
    state: "",
  },
  items: [],
  paymentMethod: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const itemAlreadyInCart = state.items.find(
        (item) => item._id == product._id
      );

      if (itemAlreadyInCart) {
        state.items.map((item) => {
          if (item._id == itemAlreadyInCart._id) {
            item.qty = product.qty;
          }
        });
      } else {
        state.items = [...state.items, product];
      }

      localStorage.setItem(`products`, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const newCartItems = state.items.filter((item) => item._id !== id);
      state.items = newCartItems;
      localStorage.setItem("products", JSON.stringify(state.items));
    },

    loadProductsFromLocalStorage: (state, action) => {
      const products = localStorage.getItem("products")
        ? JSON.parse(localStorage.getItem("products"))
        : [];

      state.items = products;
    },

    emptyCart: (state, action) => {
      state.items = [];
      localStorage.setItem(`products`, JSON.stringify(state.items));
    },

    addShippingAddress: (state, action) => {
      const shippingDeities = action.payload;
      state.shipping.address = shippingDeities.address;
      state.shipping.city = shippingDeities.city;
      state.shipping.state = shippingDeities.state;

      state.shipping.pincode = shippingDeities.pincode;

      localStorage.setItem(`shipping`, JSON.stringify(state.shipping));
    },
    loadShippingFromLocalStorage: (state, action) => {
      const data = localStorage.getItem("shipping")
        ? JSON.parse(localStorage.getItem("shipping"))
        : {
            address: "",
            city: "",
            pincode: "",
            state: "",
          };

      state.shipping = data;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  loadProductsFromLocalStorage,
  addShippingAddress,
  loadShippingFromLocalStorage,
  savePaymentMethod,
  emptyCart,
} = cartSlice.actions;
export default cartSlice.reducer;

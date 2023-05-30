import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: {
    products: [],
    page: 0,
    pages: 0,
  },
  productDeities: {
    reviews: [],
  },
  editProduct: {},
  topProducts: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadProducts: (state, action) => {
      state.allProducts = action.payload;
    },

    loadProductDeities: (state, action) => {
      state.productDeities = action.payload;
    },
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
    resetEditProduct: (state, action) => {
      state.editProduct = {};
    },
    loadTopProducts: (state, action) => {
      state.topProducts = action.payload;
    },
  },
});

export const {
  loadProducts,
  loadProductDeities,
  setEditProduct,
  resetEditProduct,
  loadTopProducts,
} = productSlice.actions;

export default productSlice.reducer;

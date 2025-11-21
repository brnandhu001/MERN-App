import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./productApis";

interface ProductState {
  items: any[];
  totalPages: number;
  page: number;
  limit: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  loading: boolean;
}

const initialState: ProductState = {
  items: [],
  totalPages: 1,
  page: 1,
  limit: 5,
  sortField: "createdAt",
  sortOrder: "desc",
  loading: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSorting: (state, action) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.totalPages = action.payload.pages;
      })

      // ADD PRODUCT
      .addCase(addProduct.fulfilled, () => {})

      // UPDATE PRODUCT
      .addCase(updateProduct.fulfilled, () => {})

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload.id);
      });
  },
});

export const { setPage, setSorting } = productSlice.actions;
export default productSlice.reducer;

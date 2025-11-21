import api from "../../api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";


// Fetch with pagination + sorting
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const state = getState() as RootState;

    const { page, limit, sortField, sortOrder } = state.products;

    const res = await api.get(
      `/products?page=${page}&limit=${limit}&sort=${sortField}&order=${sortOrder}`
    );

    return res.data;
  }
);

// Add Product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data: any) => {
    const res = await api.post("/products", data);
    return res.data;
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: any }) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return { id };
  }
);

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase";

const initialState = {
    products: [],
    loading: false,
    loadingProductId: null,
    error: null,
  };
  
  export const fetchProducts = createAsyncThunk("products/getProducts", async (_, thunkAPI) => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productsData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });
  
  const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
      setLoadingProductId: (state, action) => {
        state.loadingProductId = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload;
          state.error = null;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  const productReducer = productSlice.reducer;
  
  export const { setLoadingProductId } = productSlice.actions;

export default productReducer;
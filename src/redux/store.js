import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducers/AuthReducer";
import ProductReducer from "./reducers/ProductReducer";
import cartReducer from "./reducers/cartReducer";
import orderReducer from "./reducers/orderReducer";


const store = configureStore({
  reducer: {
    auth: AuthReducer,
    products: ProductReducer,
    carts: cartReducer,
    orders: orderReducer,
  },
});

export { store };

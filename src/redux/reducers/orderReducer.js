import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { Flip, toast } from "react-toastify";
import { db } from "../../Config/firebase";
import { addDoc, collection, doc, getDocs, writeBatch } from "firebase/firestore";

const initialState = {
    orders:[]
};

export const addOrders = createAsyncThunk("orders/addOrders",async({user,cartItems},{rejectWithValue})=>{
    try {
        const ordersData = {
            items:cartItems,
            orderDate:new Date().toISOString(),
            totalPrice:cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
        };

        // Add the order to user's order collection

        await addDoc(collection(db,`userOrders/${user.uid}/orders`),ordersData);
        //  clearing cart

        const batch = writeBatch(db);
        cartItems.forEach((item)=>{
            const cartDocRef = doc(db,`userCarts/${user.uid}/myCart`,String(item.id));
            batch.delete(cartDocRef);
        });
        await batch.commit();
        return ordersData;

    } catch (error) {
        rejectWithValue(error);
    }
});

// Getting Orders

export const getOrders = createAsyncThunk("orders/getOrders",async (userId,{rejectWithValue})=>{
    try{
        if (!userId) throw new Error("User ID is required");
        const ordersSnapshot = await getDocs(collection(db, `userOrders/${userId}/orders`));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
      return orders;
      } catch (error) {
        return rejectWithValue(error.message);
      }
});


const orderSlice = createSlice({
name:"orders",
initialState,
reducers:{},
extraReducers:(builder)=>{
    builder.addCase(addOrders.fulfilled,(state,action)=>{
        state.orders.push(action.payload);
        toast.success("🚚Order placed Successfully",{pauseOnHover:false,closeOnClick:true,transition:Flip});
    })
    .addCase(addOrders.rejected,(state,action)=>{
        toast.error('failed to order',{pauseOnHover:false,closeOnClick:true,transition:Flip})
    })
    .addCase(getOrders.fulfilled,(state,action)=>{
        state.orders = action.payload;
    })
    .addCase(getOrders.rejected,(state,action)=>{
        toast.error(`failed to fetch orders ${action.payload}`,{pauseOnHover:false,transition:Flip});
    })
}
});


const orderReducer = orderSlice.reducer;


export default orderReducer;
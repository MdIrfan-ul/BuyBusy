import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Slide, toast } from 'react-toastify';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebase';


const initialState= {
  items: []
}

// Async thunks
export const addToCart = createAsyncThunk('carts/addToCart', async ({ user, product }, { rejectWithValue }) => {
    try {
      const userId = String(user.uid);
      const productId = String(product.id);
      const cartDocRef = doc(db, `userCarts/${userId}/myCart`, productId);
      const cartDocSnapshot = await getDoc(cartDocRef);
  
      if (cartDocSnapshot.exists()) {
        // Update quantity if item already exists in the cart
        const existingQuantity = cartDocSnapshot.data().quantity || 0;
        await updateDoc(cartDocRef, {
          quantity: product.quantity || existingQuantity + 1,  // Ensure correct quantity update
        });
      } else {
        // Add new item to the cart
        await setDoc(cartDocRef, { ...product, quantity: 1 });
      }
      return product; // This will be the item with the updated quantity
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const fetchCartItems = createAsyncThunk('carts/fetchCartItems', async (userId, { rejectWithValue }) => {
  try {
    const cartCollectionRef = collection(db, `userCarts/${String(userId)}/myCart`);
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return cartItems;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeFromCart = createAsyncThunk('carts/removeFromCart', async ({ user, productId }, { rejectWithValue }) => {
    try {
      const userId = String(user.uid);
      const cartDocRef = doc(db, `userCarts/${userId}/myCart`, String(productId));
      await deleteDoc(cartDocRef); // Delete the document from Firestore
      return productId; // Return the ID of the removed item
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

    .addCase(addToCart.fulfilled, (state, action) => {
        // Update items state correctly
        const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (existingItemIndex > -1) {
          state.items[existingItemIndex] = action.payload; // Update the existing item
          toast.success('Item updated in cart!', { closeOnClick: true, pauseOnHover: false, transition: Slide });
        } else {
          state.items.push(action.payload); // Add new item
          toast.success('🛒Item added to cart!🎉', { closeOnClick: true, pauseOnHover: false, transition: Slide });

        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        toast.error(`Failed to update item in cart: ${action.payload}`, { closeOnClick: true, pauseOnHover: false, transition: Slide });
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        toast.error(`Failed to fetch cart items: ${action.payload}`, { closeOnClick: true, pauseOnHover: false, transition: Slide });
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        toast.success('Item removed from cart!', { closeOnClick: true, pauseOnHover: false, transition: Slide });
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        toast.error(`Failed to remove item from cart: ${action.payload}`, { closeOnClick: true, pauseOnHover: false, transition: Slide });
      });
  },
});

export default cartSlice.reducer;

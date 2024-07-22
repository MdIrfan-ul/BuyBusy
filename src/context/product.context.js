// src/context/product.context.js
import { createContext, useContext, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../Config/firebase";

// creating context
export const ProductContext = createContext();

// custom hook
export const useProducts = () => {
  return useContext(ProductContext);
};

// custom provider
export const ProductProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);


 
// fetching products from the db
  const getAllProducts = async () => {
    setLoading(true); // Start loading spinner
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false); // Stop loading spinner after data is fetched or error occurs
    }
  };

// adding product to cart
  const addToCart = async (user, product) => {
    const isSignedUp = localStorage.getItem("isSignedUp");
    if (isSignedUp) {
      return {
        success: false,
        message: "One Step Closer Please Login to Continue",
      };
    }
    setLoadingProductId(product.id);

    try {
      const userId = String(user.uid);
      const productId = String(product.id);

      const cartDocRef = doc(db, `userCarts/${userId}/myCart`, productId);
      const cartDocSnapshot = await getDoc(cartDocRef);

      // if product present in the cart add the quantity
      
      if (cartDocSnapshot.exists()) {
        await updateDoc(cartDocRef, {
          quantity: (cartDocSnapshot.data().quantity || 0) + 1,
        });
        return {
          success: true,
          message: "Increased product quantity in cart!",
        };
      } else {
        await setDoc(cartDocRef, { ...product, quantity: 1 });
        return { success: true, message: "🛒Item added to cart!🎉" };
      }
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      return {
        success: false,
        message: `Failed to add item to cart: ${error.message}`,
      };
    } finally {
      setLoadingProductId(null);
    }
  };
// fetching cartItems from db
  const fetchCartItems = async (user) => {
    if (!user || !user.uid) return [];
    try {
      const cartItemsSnapshot = await getDocs(
        collection(db, `userCarts/${user.uid}/myCart`)
      );
      return cartItemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        quantity: doc.data().quantity || 1,
      }));
    } catch (error) {
      console.error("Error fetching cart items: ", error);
      return [];
    }
  };

  // Calculate total price of the cart for user to order
  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Removing products from cart
  const removeFromCart = async (user, id) => {
    if (!user || !user.uid) return;
    try {
      const itemId = String(id);
      const cartDocRef = doc(db, `userCarts/${user.uid}/myCart`, itemId);
      await deleteDoc(cartDocRef);
      return { success: true, message: "Item removed from cart!" };
    } catch (error) {
      console.error("Error removing item from cart: ", error.message);
      return { success: false, message: "failed to remove cart." };
    }
  };
  
// Ordering cart 
  const addOrders = async (user, cartItems) => {
    if (!user || !user.uid) return;
    try {
      const orderData = {
        items: cartItems,
        orderDate: new Date().toISOString(),
        totalPrice: calculateTotalPrice(cartItems),
      };

      // Add the order to the user's orders collection
      await addDoc(collection(db, `userOrders/${user.uid}/orders`), orderData);

      // Clear the cart
      const batch = writeBatch(db);
      cartItems.forEach((item) => {
        const cartDocRef = doc(
          db,
          `userCarts/${user.uid}/myCart`,
          String(item.id)
        );
        batch.delete(cartDocRef);
      });
      await batch.commit();
      return { success: true, message: "🚚Order placed Successfully" };
    } catch (error) {
      console.error("Error adding order: ", error);
      return { success: false, message: "Failed to Place order" };
    }
  };

// Getting Orders
  const getOrders = async (user) => {
    if (!user || !user.uid) return [];

    try {
      const ordersSnapshot = await getDocs(collection(db, `userOrders/${user.uid}/orders`));
      return ordersSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching orders: ", error);
      return [];
    }
  };

  const value = {
    products,
    getAllProducts,
    addToCart,
    loadingProductId,
    isLoading,
    fetchCartItems,
    calculateTotalPrice,
    removeFromCart,
    addOrders,
    getOrders
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

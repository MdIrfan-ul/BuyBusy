
import React, { useEffect, useRef, useState } from "react";
import style from "./Cart.module.css";
import remove from "../../static/images/remove.png";
import add from "../../static/images/add.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { Bounce, Slide, toast } from "react-toastify";
import { useProducts } from "../../context/product.context";
import { FaShoppingCart } from "react-icons/fa";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useAuth();
  const { fetchCartItems, calculateTotalPrice, removeFromCart, addOrders } =
    useProducts();
  const navigate = useNavigate();
  const hasShownToastRef = useRef(false);

  // Getting Cart Items
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        const items = await fetchCartItems(user);
        setCartItems(items);
        if (items.length === 0 && !hasShownToastRef.current) {
          toast.info("No products in cart.", {
            pauseOnHover: false,
            transition: Bounce,
          });
          hasShownToastRef.current = true;
        }
      }
    };

    loadCartItems();
  }, [user, fetchCartItems]);

  // Calculating Total Price 
  useEffect(() => {
    const newTotalPrice = calculateTotalPrice(cartItems);
    setTotalPrice(newTotalPrice);
  }, [cartItems, calculateTotalPrice]);

  // Increase Quantity
  const handleIncrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
// Decrease Quantity
  const handleDecrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };
// Removing Cart
  const handleRemoveFromCart = async (id) => {
    if (!user || !user.uid) {
      toast.error("User is not authenticated.");
      return;
    }
    const itemId = String(id);

    try {
      console.log(`Attempting to delete document at path: userCarts/${user.uid}/myCart/${itemId}`);
      const { success, message } = await removeFromCart(user, id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      if (success) {
        toast.success(message, {
          pauseOnHover: false,
          closeOnClick: true,
          transition: Slide,
        });
      } else {
        toast.error(message, {
          pauseOnHover: false,
          closeOnClick: true,
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      toast.error("something went wrong");
    }
  };
// Order from Cart
  const handleOrderNow = async () => {
    if (cartItems.length === 0) {
      toast.error("No items in cart to order.", {
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if (!user || !user.uid) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      const { success, message } = await addOrders(user, cartItems);
      setCartItems([]);
      setTotalPrice(0);
      if (success) {
        toast.success(message, {
          pauseOnHover: false,
          closeOnClick: true,
          transition: Slide,
        });
      } else {
        toast.error(message, {
          pauseOnHover: false,
          closeOnClick: true,
          transition: Slide,
        });
      }
      navigate("/myorders");
    } catch (error) {
      console.error("Error placing order: ", error);
      toast.error("Failed to place order.");
    }
  };

  return (
    <>
      <h2 className={style.welcome}>WELCOME, {user.displayName}</h2>
      <div className={style.cartPageContainer}>
        <aside className={style.totalPrice}>
          <p>Total:&#8377;{totalPrice}</p>
          <Link to="/myorders">
            <button className={style.purchaseBtn} onClick={handleOrderNow}>
             <FaShoppingCart/> Order Now
            </button>
          </Link>
        </aside>
        <div className={style.productGridContainer}>
       
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className={style.productContainer} key={item.id}>
                <div className={style.productImageContainer}>
                  <img
                    src={item.imageUrl}
                    alt="item-Image"
                    width="100%"
                    height="100%"
                  />
                </div>
                <div className={style.productDetails}>
                  <div className={style.productName}>
                    <p>{item.title}</p>
                  </div>
                  <div className={style.productOptions}>
                    <p>&#8377;{item.price}</p>
                    <div className={style.productQuantityContainer}>
                      <img
                        src={remove}
                        alt="Decrease-Quantity"
                        onClick={() => handleDecrement(item.id)}
                      />
                      {item.quantity}
                      <img
                        src={add}
                        alt="Increase-Quantity"
                        onClick={() => handleIncrement(item.id)}
                      />
                    </div>
                  </div>
                  <button
                    className={style.removeBtn}
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove From Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 style={{ textAlign: "center" }}>No products in your cart.</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;

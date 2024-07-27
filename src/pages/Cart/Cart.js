
import React, { useEffect } from "react";
import style from "./Cart.module.css";
import remove from "../../static/images/remove.png";
import add from "../../static/images/add.png";
import { Link, useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart, fetchCartItems, removeFromCart } from "../../redux/reducers/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { addOrders } from "../../redux/reducers/orderReducer";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.carts.items); // Ensure this matches your slice state
  const { user } = useSelector((state) => state.auth);
  

  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchCartItems(user.uid));
    }
  }, [user, dispatch]);



  const handleIncrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      dispatch(addToCart({ user, product: { ...item, quantity: item.quantity + 1 } }));
    }
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      if (item.quantity > 1) {
        dispatch(addToCart({ user, product: { ...item, quantity: item.quantity - 1 } }));
      } else {
        handleRemoveFromCart(id);
      }
    }
  };
  
  

  const handleRemoveFromCart = (id) => {
    if (user && id) {
      dispatch(removeFromCart({ user, productId: id }));
    } else {
      toast.error("Unable to remove item from cart.");
    }
  };
  const handleOrderNow = () => {

    if (!user || !user.uid) {
      toast.error("User is not authenticated.");
      return;
    }
   try {
    dispatch(addOrders({user,cartItems}));
    navigate("/myorders");
   } catch (error) {
    console.log(error);
   }
  };

  return (
    <>
      <h2 className={style.welcome}>WELCOME, {user.displayName}</h2>
      <div className={style.cartPageContainer}>
        <aside className={style.totalPrice}>
          <p>Total:&#8377;{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
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

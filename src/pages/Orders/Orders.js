import React, { useEffect, useRef, useState } from "react";
import style from "./Orders.module.css";
import { useAuth } from "../../context/auth.context";
import { toast, Zoom } from "react-toastify";
import { useProducts } from "../../context/product.context";
function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const hasShownToastRef = useRef(false);
  const {getOrders} = useProducts();

  // Getting orders from db
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.uid) {
        try {
          const ordersData = await getOrders(user);
          setOrders(ordersData);

          if (ordersData.length === 0 && !hasShownToastRef.current) {
            toast.info("No orders found.", {
              pauseOnHover: false,
              transition: Zoom,
            });
            hasShownToastRef.current = true;
          }
        } catch (error) {
          console.error("Error fetching orders: ", error);
          toast.error("Failed to fetch orders.");
        }
      }
    };

    fetchOrders();
  }, [user, getOrders]);

  return (
    <>
      <div className={style.ordersContainer}>
        <h1>My Orders</h1>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div className={style.orderTime} key={index}>
              <h2>
                You Ordered On: {new Date(order.orderDate).toLocaleDateString()}
              </h2>
              <table className={style.orderTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>&#8377;{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>&#8377;{item.price * item.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3">Total Price</td>
                    <td>&#8377;{order.totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <h1 style={{ textAlign: "center" }}>No orders found.</h1>
        )}
      </div>
    </>
  );
}

export default Orders;

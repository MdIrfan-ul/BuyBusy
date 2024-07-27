import React, { useEffect} from "react";
import style from "./Orders.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/reducers/orderReducer";

function Orders() {
 
 const {user} = useSelector(state=>state.auth);
 const {orders} = useSelector(state=>state.orders);

  const dispatch = useDispatch();



  // Getting orders from db
  useEffect(() => {
    console.log('Fetching orders for user:', user); // Debugging
    if (user && user.uid) {
      dispatch(getOrders(user.uid));
    }
  }, [user,dispatch ]);
  

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

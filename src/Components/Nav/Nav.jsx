import style from "./Nav.module.css";
import Home from "../../static/images/home.png";
import Signin from "../../static/images/login.png";
import Cart from "../../static/images/cart.png";
import MyOrders from "../../static/images/orders.png";
import logOut from "../../static/images/logout.png";
import { NavLink, Outlet} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/AuthReducer";


function NavBar() {
  

  const dispatch = useDispatch();
  const{ user,isSignedUp} = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };
 
  return (
    <>
      <nav className={style.navbar}>
      <input type="checkbox" className={style.navCheck} id="navcheck"/>
      <label htmlFor="navcheck" className={style.navIcon}>
          <span></span>
          <span></span>
          <span></span>
        </label>
        <NavLink className={style.logo} to="/">
          Buy Busy
        </NavLink>
        <ul className={style.navLinks}>

          <li className={style.welcome}>WELCOME, {user ? user.displayName || 'User' : 'Guest'}</li>
          <NavLink to="/">
            <li>
              <img src={Home} alt="Home" />
              Home
            </li>
          </NavLink>
          {user  && !isSignedUp?(
            <>
              <NavLink to="/myorders">
                <li>
                  <img src={MyOrders} alt="My Orders" />
                  Orders
                </li>
              </NavLink>
              <NavLink to="/cart">
                <li>
                  <img src={Cart} alt="Cart" />
                  Cart
                </li>
              </NavLink>
              <NavLink to="/signin">
                <li onClick={handleLogout}>
                  <img src={logOut} alt="logout" />
                  Logout
                </li>
              </NavLink>
            </>
          ) : (
            <NavLink to="/signin">
              <li>
                <img src={Signin} alt="Sign In" />
                Sign In
              </li>
            </NavLink>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;

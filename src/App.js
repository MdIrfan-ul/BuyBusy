import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Orders from "./pages/Orders/Orders";
import Cart from "./pages/Cart/Cart";
import ProtectedRoute from "./ProtectedRoute";
import Page404 from "./pages/page404/page404";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { useEffect } from "react";
import { initializeAuth } from "./redux/reducers/AuthReducer";

function AppContent() {

  const dispatch = useDispatch();
  
  // Automatically login existing user
  useEffect(() => {
  dispatch(initializeAuth());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavBar />,
      errorElement: <Page404 />,
      children: [
        { index: true, element: <Home /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
        {
          path: "/cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

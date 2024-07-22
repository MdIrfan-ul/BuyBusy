import { FirebaseProvider} from "./context/auth.context";
import { ProductProvider } from "./context/product.context";
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


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavBar  />,
      errorElement:<Page404/>,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/signin",
          element:
            <SignIn/>
        },
        { path: "/signup", element:  <SignUp /> },
        {
          path: "/cart",
          element:<ProtectedRoute>
              <Cart />
              </ProtectedRoute>
        },
        {
          path: "/myorders",
          element: (
            <ProtectedRoute >
              <Orders />
              </ProtectedRoute>
          ),
        },
      ],
    },
  ]);



  return (
    <>
    <FirebaseProvider>
    <ProductProvider>
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />

    </div>
    </ProductProvider>
      </FirebaseProvider>
    </>
  );
};


export default App;

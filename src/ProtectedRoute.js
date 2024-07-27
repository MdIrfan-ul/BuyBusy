import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


// Protected route  only logged in users can access the app
const ProtectedRoute = ({ children }) => {
  const {user} = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

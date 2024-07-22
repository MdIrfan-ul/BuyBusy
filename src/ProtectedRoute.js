import { Navigate } from 'react-router-dom';
import { useAuth} from './context/auth.context';


// Protected route  only logged in users can access the app
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;

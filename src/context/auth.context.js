import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Config/firebase";

// Creating Context
export const AuthContext = createContext();

// Using the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// CustomProvider
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  
// Handle Signup Operation
  const handleSignUp = async (name,email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      console.log("signup",auth.currentUser); // Debugging
      console.log("User signed up successfully but not signed in yet.");
      return { success: true, message: "🔐User signed up successfully!Please sign in to continue."};
    } catch (error) {
      return { success: false, message: error.code };
    }
  };
// Sign in Operation
  const handleSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      localStorage.removeItem('isSignedUp');
      console.log("userCredential:-",userCredential.user);
      console.log('signed in successfully')
      return { success: true, message: "🔓User signed in successfully!", user};
    } catch (error) {
      console.log("error:", error.code);
      return { success: false, message: error.message.split(": ")[1] };
    }
  };

  // Logout from the app
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true, message: "🔒User signed out successfully!" };
    } catch (error) {
      return { success: false, message: error.code };
    }
  };

  const value = {
    user,
    handleSignUp,
    handleSignIn,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

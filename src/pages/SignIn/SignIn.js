import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import style from "./SignIn.module.css";
import { Flip, Slide, toast } from "react-toastify";

function SignIn() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const { handleSignIn, user} = useAuth();
  const isSignedUp = localStorage.getItem('isSignedUp') === 'true';

  // Navigating user to home page after signin
  useEffect(() => {
    if (user &&!isSignedUp) {
      navigate("/");
    }
  }, [user, navigate, isSignedUp]);

  const clearInput = () => {
    emailInput.current.value = "";
    passwordInput.current.value = "";
  };

  // SignIn
  const signInForm = async (e) => {
    e.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    try {
      const { success, message } = await handleSignIn(email, password);
      if (success) {
        toast.success(message,{pauseOnHover:false,transition:Flip});
        navigate('/');
      }
       else {
        toast.error(message,{pauseOnHover:false,transition:Slide});
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during sign in.",{pauseOnHover:false,transition:Slide});
    } finally {
      clearInput();
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.heading}>Sign In</h2>
      <form className={style.form} onSubmit={signInForm}>
        <input
          type="email"
          placeholder="Email"
          className={style.input}
          ref={emailInput}
        />
        <input
          type="password"
          placeholder="Password"
          className={style.input}
          ref={passwordInput}
        />
        <button type="submit" className={style.button}>
          Sign In
        </button>
      </form>
      <div className={style.signupLink}>
        <span>Don't have an account? </span>
        <NavLink to="/signup">Sign Up</NavLink>
      </div>
    </div>
  );
}

export default SignIn;

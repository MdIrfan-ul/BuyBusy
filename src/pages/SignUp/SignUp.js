import { useEffect, useRef } from "react";
import { useAuth } from "../../context/auth.context";
import style from "../SignIn/SignIn.module.css";
import { Slide, toast, Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";


function SignUp() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const nameInput = useRef();
  const {handleSignUp,user } = useAuth();
  const navigate = useNavigate();

  // Taking the user to signin page after signup
  useEffect(() => {
    const isSignedUp = localStorage.getItem('isSignedUp') === 'true';

    if (isSignedUp && !user) {
      navigate('/signin');
    }
  }, [user, navigate]);
  

  // Signup Form 

  const signUpForm = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    try {
      const result= await handleSignUp(name,email, password);
      if (result.success) {
        toast.success(result.message,{pauseOnHover:false,transition:Zoom});
        localStorage.setItem('isSignedUp', 'true'); // Set flag in local storage
        navigate('/signin');
      } else {
        toast.error(result.message,{pauseOnHover:false,transition:Slide});
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during sign up.");
    }
  };


  

  return (
    <>
      <div className={style.container}>
        <h2 className={style.heading}>Sign Up</h2>
        <form className={style.form} onSubmit={signUpForm}>
          <input
            type="text"
            placeholder="Name"
            className={style.input}
            ref={nameInput}
          />
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
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;

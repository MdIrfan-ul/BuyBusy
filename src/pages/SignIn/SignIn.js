import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import style from "./SignIn.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../../redux/reducers/AuthReducer";

function SignIn() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const {user, status} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user &&status==="signin sucess" ) {
      navigate("/");
    }
  }, [user,status, navigate]);

  const signInForm = async (e) => {
    e.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    await dispatch(signin({ email, password }));
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

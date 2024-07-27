import { useEffect, useRef } from "react";
import style from "../SignIn/SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/reducers/AuthReducer";



function SignUp() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const nameInput = useRef();
  const { status} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (status === 'signup success') {
      navigate('/signin');
    }
  }, [status, navigate]);

  const signUpForm = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    await dispatch(signup({ name, email, password }));
    
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

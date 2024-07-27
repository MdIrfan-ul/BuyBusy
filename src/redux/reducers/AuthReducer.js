import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {auth} from "../../Config/firebase";
import { createUserWithEmailAndPassword,  onAuthStateChanged,  signInWithEmailAndPassword, signOut } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { Slide, toast, Zoom } from "react-toastify";
const initialState = {
  user: null,
  status: null, 
  error: null,
  isSignedUp: false,
};

export const initializeAuth = createAsyncThunk("auth/initialize",async(_,{dispatch})=>{
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { uid, email, displayName } = currentUser;
        dispatch(setUser({ uid, email, displayName }));
      } else {
        dispatch(setUser(null));
      }
      resolve();
    });

    // Cleanup function
    return () => unsubscribe();
  });
})


export const signup = createAsyncThunk("auth/signup", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName: name });
    const { uid, email: userEmail, displayName } = userCredential.user;
    return { uid, email: userEmail, displayName };
  } catch (error) {
    const errorMessage = error.code;
    return rejectWithValue(errorMessage);
  }
});

export const signin = createAsyncThunk("auth/signin",async({email,password},{rejectWithValue})=>{
  try {
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    const { uid, email: userEmail, displayName } = userCredential.user;
    return { uid, email: userEmail, displayName };
  } catch (error) {
    const errorMessage = error.code;
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk("auth/logout",async(_,{rejectWithValue})=>{
  try{
    await signOut(auth);
    return;

  }catch(error){
console.log(error);
return rejectWithValue(error.message);
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser:(state,action)=>{
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'signup success';
        state.user = action.payload;
        state.isSignedUp = true;
        toast.success("🔐User signed up successfully!Please sign in to continue.", { pauseOnHover: false, closeOnClick: true ,transition:Slide});
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'signup failed';
        state.error = action.payload;
        toast.error(`Signup failed: ${action.payload}`, { pauseOnHover: false, closeOnClick: true ,transition:Zoom});
      })
      .addCase(signin.fulfilled,(state,action)=>{
        state.status = 'signin sucess';
        state.user = action.payload;
        state.isSignedUp=false;
        toast.success("🔓User signed in successfully!",{ pauseOnHover: false, closeOnClick: true ,transition:Slide});
      })
      .addCase(signin.rejected,(state,action)=>{
        state.status = "signin failed";
        state.error = action.payload;
        toast.error(`signin failed ${action.payload}`,{pauseOnHover:false,closeOnClick:true,transition:Zoom});
      })
      .addCase(logout.fulfilled,(state,action)=>{
        state.status ='logout success';
        state.user = action.payload;
        state.isSignedUp=false;
        toast.success("🔒User signed out successfully!",{ pauseOnHover: false, closeOnClick: true ,transition:Slide});
      })
      .addCase(logout.rejected,(state,action)=>{
        state.status = 'logout failed';
        state.user = action.payload;
        toast.error('logout failed',{ pauseOnHover: false, closeOnClick: true ,transition:Slide})
      })
  },
});

const authReducer = authSlice.reducer;
const {setUser} = authSlice.actions;

export default authReducer
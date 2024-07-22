import React from "react";
import Spinner from "react-spinner-material";
import "./spinner.css";

function LoadingSpinner(){
    return(
      <>
      <div className="spinner-container">
      <Spinner size={40} color={"#333"} width={3} visible={true} />
      <Spinner size={40} color={"#333"} width={3} visible={true} />
      <Spinner size={40} color={"#333"} width={3} visible={true} />
    </div>
      </>
     
    )
}

export default LoadingSpinner;
import React from "react";
import {toast,Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastType=(message,type)=>{
    if(type==='success'){
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Bounce,
            });
    }
    else if(type==='error'){
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Bounce,
            });
    }
}

export default toastType;
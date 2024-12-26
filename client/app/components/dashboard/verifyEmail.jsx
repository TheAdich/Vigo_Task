'use client';
import React, { useState } from "react";
import Loading from "../loading/loading";
import axios from "axios";
import authStore from "../../utils/zustandUserState";
import toastType from "../../utils/toastify";
import { ToastContainer } from "react-toastify";
const VerifyEmail = ({ user }) => {
    //const user = authStore((state) => state.user);
    const setUser = authStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState(true);
    const handleVerificationClick = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/emailVerify`, { email: user?.email })
            console.log(res.data);
            if (res.data) {
                toastType("You are now verified", "success");
                setPopup(false);
                setUser({ ...user, isVerified: true });
            }
        }
        catch (error) {
            toastType(error?.response?.data?.message, "error");
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }

    };

    return (

        <div className="relative">
        <ToastContainer/>
            {popup &&
                <div className="w-full bg-blue-500 text-white p-2 text-center cursor-pointer">
                    <span onClick={handleVerificationClick}>
                        You are not verified.Click here to get verified.
                    </span>
                </div>
            }

        </div>
    );
};

export default VerifyEmail;

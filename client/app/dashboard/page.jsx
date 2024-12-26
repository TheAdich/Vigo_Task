'use client'
import React from "react"
import Dashboard from "../components/dashboard/dashboardScreen"
import authStore from "../utils/zustandUserState"




const DashboardPage = () => {
    const user = authStore((state)=>state.user);
    //console.log(user);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Dashboard user={user}/>
    )
}

export default DashboardPage;
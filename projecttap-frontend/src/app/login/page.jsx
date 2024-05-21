"use client"

import Header from "@/components/Header"
import Buttons from "@/components/login/Buttons"
import LoginForm from "@/components/login/LoginForm"

export default function Page(){
    return <>
        {/* <Header/>
        <button className="bg-purple-400 hover:bg-purple-700 text-white font-bold rounded-full py-2 px-4 focus:outline-none focus:shadow-outline my-4" type="button">
                <a href="/">Go back</a>
        </button> */}
        <LoginForm/>
    </> 
}
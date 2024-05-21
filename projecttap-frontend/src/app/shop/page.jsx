// pages/index.js

"use client";

import { useState, useEffect } from "react";
import withAuth from "@/app/withAuth"; // Adjust the import path as needed

import CategoriesShop from "@/components/shop/CategoriesShop";
import Header from "@/components/Header";

function Page() {
    const [loginInfo, setLoginInfo] = useState([]);

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, []);

    const fetchData = async () => {
        try {
            const storedLoginInfo = JSON.parse(localStorage.getItem("loginInfo"));
            setLoginInfo(storedLoginInfo || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <Header />
            <CategoriesShop loginInfo={loginInfo} />
        </>
    );
}

export default withAuth(Page);

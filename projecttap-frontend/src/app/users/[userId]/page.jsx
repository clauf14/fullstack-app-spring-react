"use client"

import Header from "@/components/Header";
import Buttons from "@/components/userId/Buttons";
import UserInfo from "@/components/userId/UserInfo";
import { useEffect, useState } from "react";
import { request } from "@/app/axios_helper";

import withAuth from "@/app/withAuth";

export default withAuth(function Page( { params } ){
    const [user, setUser] = useState([])

    const fetchUser = async () => {
        try {
            const response = await request('GET', `http://localhost:8080/users/${params.userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [])

    return <>
        <Header/>
        <Buttons params={params}/>
        <UserInfo user={user}/>
    </>
})
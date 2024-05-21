"use client"

import { useState, useEffect } from "react";
import { request } from "@/app/axios_helper";
import Header from "@/components/Header";
import EditUser from "@/components/userId/EditUser";
import withAuth from "@/app/withAuth";


export default withAuth(function Page( {params} ){
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
        <EditUser user={user}/>
    </>
})
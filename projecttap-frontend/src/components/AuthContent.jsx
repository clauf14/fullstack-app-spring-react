"use client"
import React, { useEffect, useState } from 'react';
import { request } from '../app/axios_helper';

export default function AuthContent() {
    const [data, setData] = useState([]);

    useEffect(() => {
        request(
            "GET",
            "/messages",
            {}
        ).then((response) => {
            console.log(response);
            setData(response.data);
        });
    }, []);

    return (
        <div className="box-content h-40 w-40 p-4 border-4 border-indigo-600 mx-10 my-10">
            <h1 className="font-medium">Backend response:</h1>
            <br />
            {data && data.map((line, index) => (<li key={index}>{line}</li>))}
        </div>
    );
}

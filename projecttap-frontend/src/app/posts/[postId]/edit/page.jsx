"use client"

import Header from "@/components/Header";
import EditPostForm from "@/components/posts/[postId]/EditPostForm";
import { request } from "@/app/axios_helper";

import { useState, useEffect } from "react";

import withAuth from "@/app/withAuth";

export default withAuth(function Page({params}){
    const [post, setPost] = useState([]);
    const [photos, setPhotos] = useState([]);

    const [isLoading, setIsLoading] = useState(true)

    const fetchPost = async () => {
        try {
            const response = await request('GET', `http://localhost:8080/posts/${params.postId}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPhotos = async () => {
        try {
            const response = await request('GET', `http://localhost:8080/photos/all/post/${post.postId}`);
            setPhotos(response.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        if (post.postId) {
            fetchPhotos();
        }
    }, [post.postId]);

    useEffect(() => {
        console.log(photos)
    }, [photos])

    useEffect(() => {
        if(photos){
            setIsLoading(false);
        }
    })

    return <>
        <Header/>
        <EditPostForm post={post} photos={photos}/>
    </>
})
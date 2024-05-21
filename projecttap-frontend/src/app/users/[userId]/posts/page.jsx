"use client"
import Header from "@/components/Header";
import {useEffect, useState } from "react";

import { request } from "@/app/axios_helper";
import PostsListForUser from "@/components/userId/PostsListForUser";

import withAuth from "@/app/withAuth";

export default withAuth(function Page( { params } ){

    const [posts, setPosts] = useState([])

    const fetchPost = async () => {
        try {
            const response = await request('GET', `http://localhost:8080/posts/all/user/${params.userId}`);
            const posts = response.data;
            const postsWithPhotos = await Promise.all(posts.map(post => fetchPhoto(post.postId, post)));
            setPosts(postsWithPhotos);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPhoto = async (postId, post) => {
        try {
            const response = await request('GET', `http://localhost:8080/photos/all/post/${postId}`);
            const photos = response.data;
            return { ...post, photos };
        } catch (error) {
            console.error(`Error fetching photos for post ${postId}:`, error);
            return { ...post, photos: [] }; // Return post with empty photos array on error
        }
    };

    useEffect(() => {;
        fetchPost();
    }, [])

    useEffect(() => {
        console.log(posts)
    }, [posts])

    return <>
        <Header/>
        <PostsListForUser posts={posts} params={params}/>
    </>
})
"use client";

import withAuth from "@/app/withAuth";

import Header from "@/components/Header";
import FavoritesList from "@/components/favourites/FavoritesList";
import { useState, useEffect } from "react";
import { request } from "@/app/axios_helper";

import Loading from "@/components/Loading";

export default withAuth(function Page({ params }) {
    const [favourites, setFavourites] = useState([]);
    const [posts, setPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchFavourites = async () => {
        try {
            const response = await request('GET', `http://localhost:8080/favourites/all/user/${params.userId}`);
            setIsLoading(false)
            setFavourites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const fetchPost = async (postId) => {
        try {
            const response = await request('GET', `http://localhost:8080/posts/${postId}`);
            const post = response.data;
            const postWithPhotos = await fetchPhoto(post.postId, post);
            setIsLoading(false)
            return postWithPhotos;
        } catch (error) {
            console.error(`Error fetching post ${postId}:`, error);
            return null; // Return null on error
        }
    };

    const fetchPhoto = async (postId, post) => {
        try {
            const response = await request('GET', `http://localhost:8080/photos/all/post/${postId}`);
            const photos = response.data;
            setIsLoading(false)
            return { ...post, photos };  
        } catch (error) {
            console.error(`Error fetching photos for post ${postId}:`, error);
            return { ...post, photos: [] }; // Return post with empty photos array on error
        }
    };

    const fetchPostsForFavourites = async () => {
        try {
            const postsWithPhotos = await Promise.all(favourites.map(fav => fetchPost(fav.postId)));
            setPosts(postsWithPhotos.filter(post => post !== null)); // Filter out any null posts
        } catch (error) {
            console.error('Error fetching posts for favorites:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchFavourites();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (favourites.length > 0) {
            fetchPostsForFavourites();
        }
    }, [favourites]);

    return (
        <>
            <Header />
            {isLoading ? ( // Conditionally render loading component
              <Loading />
            ) : (
                <FavoritesList posts={posts} />
            )}
        </>
    );
})

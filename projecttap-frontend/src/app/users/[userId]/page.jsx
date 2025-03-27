"use client"

import Header from "@/components/Header"
import Buttons from "@/components/userId/Buttons"
import UserInfo from "@/components/userId/UserInfo"
import { useEffect, useState } from "react"
import { request } from "@/app/axios_helper"
import PostsListForUser from "@/components/userId/PostsListForUser"

import { getDecodedToken } from "@/app/axios_helper"

import withAuth from "@/app/withAuth"

export default withAuth(function Page({ params }) {
  const [user, setUser] = useState([])
  const [posts, setPosts] = useState([])
  const [isUserMatched, setIsUserMatched] = useState(false)

  useEffect(() => {
    const decodedToken = getDecodedToken()
    if (decodedToken) {
      try {
        if (decodedToken.id == params.userId) {
          setIsUserMatched(true)
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [params.userId])

  const fetchUser = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/users/${params.userId}`)
      console.log(response.data)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/posts/all/user/${params.userId}`)
      const posts = response.data
      const postsWithPhotos = await Promise.all(posts.map((post) => fetchPhoto(post.postId, post)))
      setPosts(postsWithPhotos)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const fetchPhoto = async (postId, post) => {
    try {
      const response = await request("GET", `http://localhost:8080/photos/all/post/${postId}`)
      const photos = response.data
      return { ...post, photos }
    } catch (error) {
      console.error(`Error fetching photos for post ${postId}:`, error)
      return { ...post, photos: [] } // Return post with empty photos array on error
    }
  }

  useEffect(() => {
    fetchPost()
  }, [])

  useEffect(() => {
    console.log(posts)
  }, [posts])

  return (
    <>
      <Header />
      <Buttons params={params} isUserMatched={isUserMatched} />
      <UserInfo user={user} params={params} />
      <PostsListForUser posts={posts} isUserMatched={isUserMatched} />
    </>
  )
})

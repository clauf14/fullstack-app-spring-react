"use client"
import { useEffect, useState } from "react"
import { request } from "@/app/axios_helper"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import Location from "@/components/posts/[postId]/Location"
import Header from "@/components/Header"
import Loading from "@/components/Loading"

import withAuth from "@/app/withAuth"
import ShowProfilePicture from "@/components/ShowProfilePicture"

export default withAuth(function Page({ params }) {
  const [post, setPost] = useState({})
  const [user, setUser] = useState({})
  const [photos, setPhotos] = useState([])
  const [subcategory, setSubcategory] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  const [loginInfo, setLoginInfo] = useState([])

  const fetchData = async () => {
    try {
      setLoginInfo(JSON.parse(localStorage.getItem("loginInfo")))
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchPost = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/posts/${params.postId}`)
      setPost(response.data)
      setUser(response.data.userId)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/users/${user}`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchPhotos = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/photos/all/post/${post.postId}`)
      setPhotos(response.data) // Assuming response.data is an array of photo URLs
    } catch (error) {
      console.error("Error fetching photos:", error)
    }
  }

  const fetchSubcategory = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/subcategory/${post.subcategoryId}`)
      setSubcategory(response.data) // Assuming response.data is an array of photo URLs
    } catch (error) {
      console.error("Error fetching subcategory:", error)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await request("GET", `http://localhost:8080/favourites/all`)
      const favorites = response.data
      const isFav = favorites.some((fav) => fav.postId === post.postId && fav.userId === loginInfo.id)
      setIsFavorite(isFav)
    } catch (error) {
      console.error("Error checking favorites:", error)
    }
  }

  const toggleFavorite = async () => {
    try {
      await request("POST", `/favourites/add`, {
        postId: post.postId,
        userId: loginInfo.id,
      })
      setIsFavorite(true)
      alert("Post added to favorites!")
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchPost()
  }, [])

  useEffect(() => {
    if (post.userId) {
      fetchUser()
    }
  }, [post.userId])

  useEffect(() => {
    if (post.postId) {
      fetchPhotos()
      checkFavorite()
    }
  }, [post.postId])

  useEffect(() => {
    if (post.subcategoryId) {
      fetchSubcategory()
    }
  }, [post.subcategoryId])

  useEffect(() => {
    if (photos) {
      setIsLoading(false)
      console.log(post)
    }
  })

  return (
    <>
      <Header />
      <div>
        <a href="/shop">
          <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 mb-2 mx-4">Go back to the shop</button>
        </a>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-4 lg:mx-16">
          <div className="lg:col-span-2">
            <div className="mx-auto mb-4 overflow-hidden rounded shadow-lg bg-black h-[300px] sm:h-[400px] md:h-[500px] xl:h-[600px]">
              {photos.length === 1 ? (
                <div className="h-full overflow-hidden flex justify-center items-center">
                  <img src={`http://localhost:8080/photos/display/${photos[0].photoId}`} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-full lg:px-8">
                  <Slider className="w-full h-full">
                    {photos.map((photo, index) => (
                      <div key={index} className="w-full h-full flex justify-center items-center">
                        <img src={`http://localhost:8080/photos/display/${photo.photoId}`} alt={`Photo ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>

            <div className="bg-white rounded shadow-lg px-5 py-5 mb-2">
              <div className="my-5">
                <span className="flex items-center">
                  <span className="mr-1 text-sm">Posted at {new Date(post.created).toLocaleString()}</span>
                  <button onClick={toggleFavorite} className="ml-auto text-2xl" disabled={isFavorite}>
                    {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                </span>
              </div>
              <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
              <p className="text-gray-700 text-3xl font-bold mb-4">{`${post.price} ${post.currency}`}</p>
              <div className="mb-5">
                <p className="inline-block text-gray-700 border border-gray-300 rounded-md p-2 mr-2 sm:mr-0">{`Status: ${post.status}`}</p>
                <p className="inline-block text-gray-700 border border-gray-300 rounded-md p-2 mt-2 sm:ml-2">{`Subcategory: ${subcategory.title}`}</p>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-4">Description</h1>
                <p className="text-md text-gray-700">{post.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow-lg px-5 py-5 mb-10 lg:col-span-1">
            <h1 className="text-2xl font-semibold mb-4">Seller</h1>
            <div className="flex items-center space-x-4 mb-4">
              <ShowProfilePicture user={user} />
              <p className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <p className="text-xl font-semibold mb-4">{`Email: ${user.email}`}</p>
            <p className="text-lg font-semibold mb-4">{`Phone number: ${user.phoneNumber}`}</p>
            <a href={`/users/${user.id}`} className="text-md underline">
              See more posts from this user
            </a>
            <Location post={post} />
          </div>
        </div>
      )}
    </>
  )
})

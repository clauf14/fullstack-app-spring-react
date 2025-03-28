import { useState, useEffect } from "react"
import { request } from "@/app/axios_helper"
import Loading from "../../components/Loading"

export default function ProductsList({ selectedSubcategory, searchQuery, loginInfo }) {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDataPost = async () => {
    try {
      const response = await request("GET", "http://localhost:8080/posts/all")
      const posts = response.data

      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const postWithPhotos = await fetchDataPhoto(post.postId, post)
          const postWithLocation = await fetchLocation(post.locationId, postWithPhotos)
          return postWithLocation
        })
      )

      setPostList(postsWithDetails)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setIsLoading(false)
    }
  }

  const fetchDataPhoto = async (postId, post) => {
    try {
      const response = await request("GET", `http://localhost:8080/photos/all/post/${postId}`)
      return { ...post, photos: response.data }
    } catch (error) {
      console.error(`Error fetching photos for post ${postId}:`, error)
      return { ...post, photos: [] }
    }
  }

  const fetchLocation = async (locationId, post) => {
    try {
      const response = await request("GET", `/location/${locationId}`)
      return { ...post, location: response.data.name }
    } catch (error) {
      console.error(`Error fetching location for post ${post.postId}:`, error)
      return { ...post, location: "Unknown location" }
    }
  }

  useEffect(() => {
    fetchDataPost()
  }, [])

  let filteredPosts = selectedSubcategory ? postList.filter((post) => post.subcategoryId === selectedSubcategory) : postList

  filteredPosts = searchQuery ? filteredPosts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())) : filteredPosts

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-center mx-4 text-xl font-semibold">
            Welcome to the shop, {loginInfo.firstName} {loginInfo.lastName}!
          </h1>
          <div className="flex flex-wrap justify-center bg-gray-100 py-5">
            {filteredPosts.length === 0 ? (
              <div className="text-center text-2xl mt-10 font-semibold text-gray-700">No products found</div>
            ) : (
              filteredPosts.map((post, index) => (
                <a
                  key={index}
                  href={`/posts/${post.postId}`}
                  className="rounded-2xl overflow-hidden shadow-lg w-1/2 mx-3 mb-8 max-w-[160px] sm:max-w-[300px]"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    className="w-full object-cover h-36 sm:h-36 md:h-48"
                    src={post.photos.length > 0 ? `http://localhost:8080/photos/display/${post.photos[0].photoId}` : "https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg"}
                    alt=""
                  />

                  <div className="px-2 pt-3 h-28">
                    <div className="font-bold text-sm sm:text-md mb-2 pl-2">
                      <span className="sm:hidden">{post.title.length > 25 ? post.title.slice(0, 30) + "..." : post.title}</span>
                      <span className="hidden sm:inline">{post.title.length > 60 ? post.title.slice(0, 60) + "..." : post.title}</span>
                    </div>
                    <p className="bg-gray-200 rounded-full px-3 py-2 text-sm sm:text-md font-bold text-gray-900 mb-2">{`${post.price} ${post.currency}`}</p>
                  </div>

                  <div className="px-2 pt-2 pb-2">
                    <p className="bg-gray-200 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">{post.status}</p>
                    <p className="bg-gray-200 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 mt-2">{post.location}</p>
                    <p className="bg-gray-200 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 mt-2 mb-2">{`Added at ${new Date(post.created).toLocaleString()}`}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </>
      )}
    </>
  )
}

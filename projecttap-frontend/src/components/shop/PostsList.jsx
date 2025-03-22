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
      const postsWithPhotos = await Promise.all(posts.map((post) => fetchDataPhoto(post.postId, post)))

      setPostList(postsWithPhotos)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setIsLoading(false)
    }
  }

  const fetchDataPhoto = async (postId, post) => {
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
    fetchDataPost()
  }, [])

  // Filter the postList based on the selected subcategory
  let filteredPosts = selectedSubcategory ? postList.filter((post) => post.subcategoryId === selectedSubcategory) : postList

  // Filter the postList based on the searchQuery
  filteredPosts = searchQuery ? filteredPosts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())) : filteredPosts

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="mx-32 text-xl font-semibold">
            Welcome to the shop, {loginInfo.firstName} {loginInfo.lastName}!
          </h1>
          <div className="relative overflow-x-auto flex flex-wrap justify-center bg-gray-100 py-5">
            {filteredPosts.length === 0 ? (
              <div className="text-center text-2xl mt-10 font-semibold text-gray-700">No products found</div>
            ) : (
              filteredPosts.map((post, index) => (
                <a
                  key={index}
                  href={`/posts/${post.postId}`}
                  className="max-w-sm rounded overflow-hidden shadow-lg w-1/2 px-2 mx-3 mb-10"
                  style={{ maxWidth: "300px", textDecoration: "none", color: "inherit" }}
                >
                  <img
                    className="w-full h-48 object-cover"
                    src={post.photos.length > 0 ? `http://localhost:8080/photos/display/${post.photos[0].photoId}` : "https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg"}
                    alt=""
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{post.title}</div>
                    <p className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{post.status}</p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{`${post.price} ${post.currency}`}</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{post.location}</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{`Added at ${new Date(post.created).toLocaleString()}`}</span>
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

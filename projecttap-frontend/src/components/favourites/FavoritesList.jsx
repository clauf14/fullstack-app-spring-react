import { useState } from "react"
import Loading from "../Loading"
import { request } from "@/app/axios_helper"
import { FaHeartBroken } from "react-icons/fa"

export default function FavoritesList({ posts }) {
  const deleteFromFavourites = async (e, postId) => {
    e.preventDefault()
    try {
      await request("DELETE", `http://localhost:8080/favourites/remove/${postId}`)
      alert("Post removed from favourites!")
      window.location.reload()
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  return (
    <div className="min-h-screen">
      <a href={`/shop`}>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-4 lg:mx-16 px-4 my-5">Go back</button>
      </a>
      <div>
        {posts.length !== 0 ? (
          posts.map((post) => (
            <div key={post.postId} className="flex flex-col-reverse md:flex-row mb-6 mx-4 lg:mx-16 bg-white shadow-md rounded-lg p-5">
              {/* Text & Buttons Section */}
              <div className="flex-1">
                <h1 className="text-lg font-bold mb-4">{post.title}</h1>
                <p className="text-gray-500">Post ID: {post.postId}</p>
                <p className="text-gray-500">Location: {post.location}</p>
                <p className="text-gray-500">Created: {new Date(post.created).toLocaleString()}</p>
                <p className="text-gray-500">
                  Price: {post.price} {post.currency}
                </p>
                <p className="text-gray-500">Status: {post.status}</p>
                <p className="text-gray-500 mb-4">Subcategory ID: {post.subcategoryId}</p>

                <div className="flex space-x-3 mt-3">
                  <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4" onClick={() => (window.location.href = `/posts/${post.postId}`)}>
                    View post
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full py-2 px-4 flex items-center" onClick={(e) => deleteFromFavourites(e, post.postId)}>
                    Delete
                    <FaHeartBroken className="ml-2" />
                  </button>
                </div>
              </div>

              {/* Image Section - Moves to top on small screens */}
              <div className="w-full md:w-60 h-60 flex-shrink-0 mb-4 md:mb-0 md:ml-4">
                <img src={`http://localhost:8080/photos/display/${post.photos[0].photoId}`} alt="Post Image" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-12 mx-8">
            <p className="text-3xl font-extrabold">You do not have any favourites associated with your profile</p>
          </div>
        )}
      </div>
    </div>
  )
}

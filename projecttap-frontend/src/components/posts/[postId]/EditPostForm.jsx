import { useState, useEffect } from "react"
import { getAuthenticationToken, request } from "@/app/axios_helper"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { MdDeleteForever } from "react-icons/md"
import Loading from "@/components/Loading"
import LocationPicker from "@/components/shop/add/LocationPicker"

export default function EditPostForm({ post, photos }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("EUR")
  const [status, setStatus] = useState("Used")
  const [files, setFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const [locationId, setLocationId] = useState("null")
  const [locationName, setLocationName] = useState("")
  const [locationLatitude, setLocationLatitude] = useState("")
  const [locationLongitude, setLocationLongitude] = useState("")

  useEffect(() => {
    if (post && post.locationId) {
      request("GET", `/location/${post.locationId}`)
        .then((response) => {
          const locationData = response.data
          setTitle(post.title || "")
          setDescription(post.description || "")
          setStatus(post.status || "")
          setPrice(post.price || "")
          setCurrency(post.currency || "")
          setLocationId(locationData.locationId)
          setLocationName(locationData.name || "")
          setLocationLatitude(locationData.latitude || "")
          setLocationLongitude(locationData.longitude || "")
          setIsLoading(false)
          console.log(response)
        })
        .catch((error) => {
          console.error("Error fetching location data:", error)
        })
    }
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getAuthenticationToken()

    const locationResponse = await request("PUT", `/location/update`, {
      locationId: locationId,
      name: locationName,
      latitude: locationLatitude,
      longitude: locationLongitude,
    })

    if (locationResponse.data) {
      try {
        const response = await request("PUT", `/posts/edit/${post.postId}`, {
          title: title,
          description: description,
          price: price,
          locationId: locationId,
          status: status,
          currency: currency,
        })

        if (response) {
          const postId = post.postId
          for (const file of files) {
            const formData = new FormData()
            formData.append("image", file)
            formData.append("postId", postId)
            console.log(formData instanceof FormData)

            const photoResponse = await fetch(`http://localhost:8080/photos/add/post`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
              body: formData,
            })

            if (photoResponse.ok) {
              console.log("Image added successfully")
            } else {
              console.error("Failed to add image")
            }
          }

          alert(`Product with id ${post.postId} has been updated successfully!`)
          setFiles([])
          setPreviewImages([])
          window.location.reload()
        }
      } catch (error) {
        console.error("Error adding post and images:", error)
      }
    }
  }

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files
    if (selectedFiles.length === 0) {
      return
    } else {
      const selectedFilesArray = Array.from(selectedFiles)
      setFiles(selectedFilesArray)

      const previews = []
      selectedFilesArray.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result)
          if (previews.length === selectedFilesArray.length) {
            setPreviewImages(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handlePhotoDelete = async (e, photoId) => {
    e.preventDefault()
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        const response = await request("DELETE", `/photos/delete/${photoId}`)
        if (response.ok) {
          console.error("Deleting the photo failed", response)
        } else {
          window.location.reload()
        }
      } catch (error) {
        console.error("Deleting the photo failed", error)
      }
    }
  }

  return (
    <>
      <a href={`/users/${post.userId}`}>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mt-5 mx-4 md:mx-28 px-4">Go back</button>
      </a>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-center bg-gray-100 mx-4 md:mx-28 py-4">
          <div className="bg-white p-4 rounded-md shadow-lg w-full">
            <h1 className="text-2xl font-semibold mb-2">Current photos</h1>
            {photos.length === 1 ? (
              <div className="max-w-96 md:max-h-96 overflow-hidden flex justify-center items-center px-10 py-4 relative">
                <img src={`http://localhost:8080/photos/display/${photos[0].photoId}`} alt="Preview" className="w-full h-100 object-cover rounded-lg shadow-lg" />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-0 py-4">
                {photos.map((photo, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden shadow-lg w-1/2 mx-3 mb-2 max-w-32 max-h-36 sm:max-w-64 sm:max-h-64 md:max-w-76 md:max-h-76 xl:max-w-96 xl:max-h-96 relative">
                    <img className="w-full object-cover h-36 sm:h-36 md:h-48" src={`http://localhost:8080/photos/display/${photo.photoId}`} alt={`Photo ${index}`} />
                    <button className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded" onClick={(e) => handlePhotoDelete(e, photo.photoId)}>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <MdDeleteForever style={{ fontSize: "1.5em" }} />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <h1 className="text-2xl font-semibold mb-2">New photos</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {previewImages.length === 1 ? (
                <div className="flex flex-wrap justify-center gap-0">
                  <div className="mb-4 flex justify-center max-w-96 md:max-h-96">
                    <img src={previewImages[0]} alt="Preview 0" className="mb-2 rounded-lg shadow-lg object-contain w-full h-full" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-0">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="rounded-2xl overflow-hidden shadow-lg w-1/2 mx-3 mb-2 max-w-32 max-h-36 sm:max-w-64 sm:max-h-64 md:max-w-76 md:max-h-76 xl:max-w-96 xl:max-w-96">
                      <img className="w-full object-cover h-36 sm:h-36 md:h-48" src={preview} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Images</label>
                <input
                  type="file"
                  className="form-control mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring focus:ring-indigo-600"
                  id="image"
                  name="image"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="Upload"
                  onChange={handleFileChange}
                  multiple
                />
              </div>

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  id="description"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Used">Used</option>
                  <option value="Almost New">Almost New</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency:
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="EUR">EUR</option>
                  <option value="RON">RON</option>
                </select>
              </div>

              <LocationPicker
                locationName={locationName}
                locationLatitude={locationLatitude}
                locationLongitude={locationLongitude}
                setLocationName={setLocationName}
                setLocationLatitude={setLocationLatitude}
                setLocationLongitude={setLocationLongitude}
              />

              <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" type="submit">
                  Update post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

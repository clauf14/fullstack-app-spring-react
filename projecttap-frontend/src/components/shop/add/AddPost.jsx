import { useEffect, useState } from "react"
import { getAuthenticationToken, request } from "@/app/axios_helper"
import { useRouter } from "next/navigation"
import Loading from "../../../components/Loading"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import PreviewAndAddImages from "@/components/PreviewAndAddImages"
import LocationPicker from "./LocationPicker"

export default function AddPost({ selectedSubcategory, aiOn, setAiOn, setSelectedCategory, setSelectedSubcategory, setSelectedCategoryName, setSelectedSubcategoryName }) {
  const router = useRouter()

  const [language, setLanguage] = useState("english")
  const [communicationStyle, setCommunicationStyle] = useState("formal")
  const [loadingAi, setLoadingAi] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [userId, setUserId] = useState()
  const created = Date.now()
  const [currency, setCurrency] = useState("EUR")
  const [status, setStatus] = useState("Used")
  const [files, setFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  //for location
  const [locationName, setLocationName] = useState("")
  const [locationLatitude, setLocationLatitude] = useState("")
  const [locationLongitude, setLocationLongitude] = useState("")

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    if (loginInfo) {
      setUserId(loginInfo.id)
    }
  }, [])

  const typewriterEffect = (text, setter) => {
    if (!text) return
    text = String(text)

    let index = 0
    setter(" ")

    const interval = setInterval(() => {
      if (index >= text.length || text[index] === "®") {
        clearInterval(interval)
        return
      }

      setter((prev = "") => prev + text[index])
      index++
    }, 20)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getAuthenticationToken()

    const locationResponse = await request("POST", "/location/add", {
      name: locationName,
      latitude: locationLatitude,
      longitude: locationLongitude,
    })

    if (locationResponse.data) {
      const newLocationId = locationResponse.data.locationId
      if (!aiOn) {
        try {
          const response = await request("POST", "/posts/add", {
            title: title,
            description: description,
            price: price,
            userId: userId,
            locationId: newLocationId,
            subcategoryId: selectedSubcategory,
            created: created,
            status: status,
            currency: currency,
          })

          console.log(response.data)

          if (response.data) {
            const postId = response.data
            for (const file of files) {
              const formData = new FormData()
              formData.append("image", file)
              formData.append("postId", postId)

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
            alert("Product added successfully")
            setFiles([])
            setPreviewImages([])
            setTitle("")
            setDescription("")
            setPrice("")
            setLocationName("")
            router.push(`/posts/${postId}`)
          }
        } catch (error) {
          console.error("Error adding post and images:", error)
        }
      } else {
        const formData = new FormData()
        for (const file of files) {
          formData.append("file", file)
        }
        formData.append("status", status)
        formData.append("price", price)
        formData.append("currency", currency)
        formData.append("location", locationName)
        formData.append("language", language)
        formData.append("generating_style", communicationStyle)

        try {
          setLoadingAi(true)
          const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const result = await response.json()
          console.log("Prediction Result:", result)
          setLoadingAi(false)
          setAiOn(false)

          setSelectedSubcategoryName(result.subcategory_name)
          setSelectedCategoryName(result.category_name)
          setSelectedSubcategory(result.subcategory_id)
          setSelectedCategory(result.category_id)

          typewriterEffect(result.title, setTitle)
          typewriterEffect(result.description, setDescription)
        } catch (error) {
          console.error("Error uploading file(s):", error)
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <PreviewAndAddImages typeOfAdd={"multiple"} setFiles={setFiles} setPreviewImages={setPreviewImages} previewImages={previewImages} />

          {loadingAi && (
            <>
              <Loading />
              <div>
                <h2 className="text-xl font-bold my-4 text-gray-900 text-center">We are generating your desired ad!</h2>
              </div>
            </>
          )}
          {!loadingAi && (
            <>
              {!aiOn && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title:
                    </label>
                    <input
                      required
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
                </div>
              )}

              {/* container for selecting the language and type of communication */}
              {aiOn && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      required
                      id="language"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="romanian">Romanian</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="communicationStyle" className="block text-sm font-medium text-gray-700">
                      Type of communication style:
                    </label>
                    <select
                      id="communicationStyle"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                      value={communicationStyle}
                      onChange={(e) => setCommunicationStyle(e.target.value)}
                    >
                      <option value="formal">Formal</option>
                      <option value="professional">Professional</option>
                      <option value="normal">Normal</option>
                      <option value="funny">Funny</option>
                      <option value="sarcastic">Sarcastic</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  required
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
                  required
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
                  required
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

              {/* <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location:
                </label>
                <input
                  required
                  type="text"
                  id="location"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div> */}

              <LocationPicker
                locationName={locationName}
                locationLatitude={locationLatitude}
                locationLongitude={locationLongitude}
                setLocationName={setLocationName}
                setLocationLatitude={setLocationLatitude}
                setLocationLongitude={setLocationLongitude}
              />

              {aiOn && (
                <div className="flex justify-end">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" type="submit">
                    Next
                  </button>
                </div>
              )}

              {!aiOn && (
                <div className="flex justify-end">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" type="submit">
                    Post
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}

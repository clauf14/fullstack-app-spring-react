"use client"
import { request } from "@/app/axios_helper"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { useState, useEffect, use } from "react"
import AddPost from "./AddPost"

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("")

  //for ai windows
  const [isOpen, setIsOpen] = useState(false)
  const [aiOn, setAiOn] = useState(false)
  const [continueAi, setContinueAi] = useState(false)

  const images = ["/images/chair-ok.png", "/images/set-of-cups-ok.png", "/images/chair-nok.png", "/images/set-of-cups-nok.png"]

  useEffect(() => {
    request("GET", "http://localhost:8080/category/all")
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.error("Error fetching categories:", error)
      })
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      request("GET", `http://localhost:8080/subcategory/display/${selectedCategory}`)
        .then((response) => {
          setSubcategories(response.data)
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error)
        })
    }
  }, [selectedCategory])

  const handleAi = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setContinueAi(false)
    setAiOn(false)
  }

  const enableAi = () => {
    setAiOn(true)
    setContinueAi(false)
    setIsOpen(false) // Optionally close the modal after enabling AI
  }

  const handleContinueAi = () => {
    setContinueAi(true)
    setIsOpen(false)
  }

  const handleCategoryChange = (event) => {
    const selectedCategoryNa = event.target.value
    const matchedCategory = categories.find((category) => category.title === selectedCategoryNa)
    setSelectedCategoryName(selectedCategoryNa)
    if (matchedCategory) {
      setSelectedCategory(matchedCategory.categoryId)
    }
  }

  const handleSubcategoryChange = (event) => {
    const selectedSubcategoryNa = event.target.value
    const matchedSubcategory = subcategories.find((subcategory) => subcategory.title === selectedSubcategoryNa)
    setSelectedSubcategoryName(selectedSubcategoryNa)
    if (matchedSubcategory) {
      setSelectedSubcategory(matchedSubcategory.subcategoryId)
    }
  }

  return (
    <>
      <div className="py-4 mx-4 md:mx-28">
        <h2 className="text-2xl font-bold text-gray-900">Try our AI feature for a faster and seamless process! 🤖</h2>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 mt-4" onClick={handleAi}>
          Click here to learn more ✨
        </button>
        <p className="text-sm mt-1 text-gray-400 max-w-64">*This feature is currently in development. You will acces a BETA version of it!</p>
      </div>

      {aiOn && <p className="mt-2 text-green-600 font-bold mx-4 md:mx-28">✅ AI is now enabled! Upload a photo and let the magic happen!</p>}

      {/* first window of ai modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl overflow-y-auto max-h-[80vh] mx-4">
            <h3 className="text-md sm:text-xl font-bold">ReTrove Market BETA AI Feature</h3>
            <p className="mt-4 text-xs sm:text-sm text-gray-600">
              By proceeding, you acknowledge and agree to the terms of this generative AI system for object detection. This system will analyze the provided photo, detect objects, generate a title and
              description, and classify the object into a category and subcategory.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Please note that this AI model is currently in beta and may have limitations or inaccuracies in object detection and classification. While we strive for accuracy, errors may occur, and
              we encourage user verification of results.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">By continuing, you accept these conditions and understand the experimental nature of this feature.</p>

            <h4 className="mt-4 text-md sm:text-xl font-bold">80 Available Categories:</h4>
            <div className="mt-2 text-gray-600 text-xs sm:text-sm space-y-1 max-h-40 overflow-y-auto">
              <p>
                <strong>Human & Transportation:</strong> Person, Bicycle, Car, Motorcycle, Airplane, Bus, Train, Truck, Boat
              </p>
              <p>
                <strong>Traffic & Public Infrastructure:</strong> Traffic Light, Fire Hydrant, Stop Sign, Parking Meter, Bench
              </p>
              <p>
                <strong>Animals:</strong> Bird, Cat, Dog, Horse, Sheep, Cow, Elephant, Bear, Zebra, Giraffe
              </p>
              <p>
                <strong>Accessories & Sports Equipment:</strong> Backpack, Umbrella, Handbag, Tie, Suitcase, Frisbee, Skis, Snowboard, Sports Ball, Kite, Baseball Bat, Baseball Glove, Skateboard,
                Surfboard, Tennis Racket
              </p>
              <p>
                <strong>Kitchen & Dining Items:</strong> Bottle, Wine Glass, Cup, Fork, Knife, Spoon, Bowl, Banana, Apple, Sandwich, Orange, Broccoli, Carrot, Hot Dog, Pizza, Donut, Cake
              </p>
              <p>
                <strong>Furniture & Home Essentials:</strong> Chair, Couch, Potted Plant, Bed, Dining Table, Toilet
              </p>
              <p>
                <strong>Electronics & Devices:</strong> TV, Laptop, Mouse, Remote, Keyboard, Cell Phone, Microwave, Oven, Toaster, Sink, Refrigerator
              </p>
              <p>
                <strong>Miscellaneous Objects:</strong> Book, Clock, Vase, Scissors, Teddy Bear, Hair Dryer, Toothbrush
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={enableAi}>
                      Enable AI ✅
                    </button> */}
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleContinueAi}>
                Continue
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>
                Close ❌
              </button>
            </div>
          </div>
        </div>
      )}

      {/* second window of ai modal */}
      {continueAi && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 9999 }} // Ensures modal stays on top
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl overflow-y-auto max-h-[80vh] mx-4">
            <h3 className="text-md sm:text-xl font-bold">ReTrove Market BETA AI Feature</h3>
            <h2 className="text-sm sm:text-md font-bold">Tutorial: How to?</h2>
            <p className="mt-2 text-sm text-gray-600 mb-2">
              For the detection to be as accurate as possible, try uploading a photo with your product on a plain background and in the center of the image. If not possible, make sure that the main
              object you are interested in selling takes up the most space in the picture, like in the examples below.(slide trough images)
            </p>

            <div className="overflow-hidden flex justify-center items-center px-10 bg-black w-full h-68">
              <Slider className="w-80 h-68 flex items-center justify-center">
                {images.map((img, index) => (
                  <div key={index} className="flex justify-center items-center">
                    <img src={img} alt={`Preview ${index}`} className="rounded-lg shadow-lg object-contain max-w-full max-h-full" />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={enableAi}>
                Enable AI ✅
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>
                Close ❌
              </button>
            </div>
          </div>
        </div>
      )}

      {!aiOn && (
        <div className="space-y-4 bg-white p-8 rounded-md shadow-lg mx-4 md:mx-28">
          <select
            value={selectedCategoryName}
            onChange={handleCategoryChange}
            required
            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
          >
            <option required value="">
              Select a category
            </option>
            {categories.map((category) => (
              <option required key={"key" + category.categoryId} value={category.categoryid}>
                {category.title}
              </option>
            ))}
          </select>
          {subcategories.length > 0 && (
            <div>
              <select
                value={selectedSubcategoryName}
                onChange={handleSubcategoryChange}
                required
                className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
              >
                <option required value="">
                  Select a subcategory
                </option>
                {subcategories.map((subcategory) => (
                  <option required key={subcategory.subcategoryId} value={subcategory.subcategoryid}>
                    {subcategory.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      <AddPost
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
        setSelectedCategoryName={setSelectedCategoryName}
        setSelectedSubcategoryName={setSelectedSubcategoryName}
        selectedSubcategory={selectedSubcategory}
        aiOn={aiOn}
        setAiOn={setAiOn}
      />
    </>
  )
}

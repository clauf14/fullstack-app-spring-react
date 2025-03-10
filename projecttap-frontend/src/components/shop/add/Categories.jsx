"use client"
import { request } from "@/app/axios_helper";

import { useState, useEffect } from "react";
import AddPost from "./AddPost";

export default function Categories(){
const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('')

  //for ai window
  const [isOpen, setIsOpen] = useState(false)
  const [aiOn, setAiOn] = useState(false)

  useEffect(() => {
    request('GET', "http://localhost:8080/category/all")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      request('GET', `http://localhost:8080/subcategory/display/${selectedCategory}`)
        .then((response) => {
          setSubcategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
        });
    }
  }, [selectedCategory]);

  const handleAi = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAiOn(false)
  };

  const enableAi = () => {
    setAiOn(true);
    setIsOpen(false); // Optionally close the modal after enabling AI
  };

  
  const handleCategoryChange = (event) => {
    const selectedCategoryNa = event.target.value;
    const matchedCategory = categories.find(category => category.title === selectedCategoryNa);
    setSelectedCategoryName(selectedCategoryNa);
    if (matchedCategory) {
        setSelectedCategory(matchedCategory.categoryId);
    }

    }

  const handleSubcategoryChange = (event) => {
    const selectedSubcategoryNa = event.target.value;
    const matchedSubcategory = subcategories.find(subcategory => subcategory.title === selectedSubcategoryNa);
    setSelectedSubcategoryName(selectedSubcategoryNa);
        if (matchedSubcategory) {
        setSelectedSubcategory(matchedSubcategory.subcategoryId);
        }   
    };

    return (
      <>
        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-900">Try our AI feature for a faster and seamless process! 🤖</h2>
          <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 mt-4" onClick={handleAi}>Click here to learn more ✨</button>
          <p className="text-sm mt-1 text-gray-400 max-w-64">*This feature is currently in development. You will acces a BETA version of it!</p>
        </div>

        {aiOn && (
          <p className="mt-2 text-green-600 font-bold">✅ AI is now enabled! Upload some photos and let the magic happen!</p>
        )}

        {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl overflow-y-auto max-h-[80vh]">
                  <h3 className="text-2xl font-bold">ReTrove Market BETA AI Feature</h3>
                  <p className="mt-4 text-gray-600">
                    By proceeding, you acknowledge and agree to the terms of this generative AI system for object detection. 
                    This system will analyze the provided photo, detect objects, generate a title and description, and classify 
                    the object into a category and subcategory.
                  </p>
                  <p className="mt-2 text-gray-600">
                    Please note that this AI model is currently in beta and may have limitations or inaccuracies in object 
                    detection and classification. While we strive for accuracy, errors may occur, and we encourage user verification of results.
                  </p>
                  <p className="mt-2 text-gray-600">
                    By continuing, you accept these conditions and understand the experimental nature of this feature.
                  </p>
                  
                  <h4 className="mt-4 text-xl font-bold">80 Available Categories:</h4>
                  <div className="mt-2 text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto">
                    <p><strong>Human & Transportation:</strong> Person, Bicycle, Car, Motorcycle, Airplane, Bus, Train, Truck, Boat</p>
                    <p><strong>Traffic & Public Infrastructure:</strong> Traffic Light, Fire Hydrant, Stop Sign, Parking Meter, Bench</p>
                    <p><strong>Animals:</strong> Bird, Cat, Dog, Horse, Sheep, Cow, Elephant, Bear, Zebra, Giraffe</p>
                    <p><strong>Accessories & Sports Equipment:</strong> Backpack, Umbrella, Handbag, Tie, Suitcase, Frisbee, Skis, Snowboard, Sports Ball, Kite, Baseball Bat, Baseball Glove, Skateboard, Surfboard, Tennis Racket</p>
                    <p><strong>Kitchen & Dining Items:</strong> Bottle, Wine Glass, Cup, Fork, Knife, Spoon, Bowl, Banana, Apple, Sandwich, Orange, Broccoli, Carrot, Hot Dog, Pizza, Donut, Cake</p>
                    <p><strong>Furniture & Home Essentials:</strong> Chair, Couch, Potted Plant, Bed, Dining Table, Toilet</p>
                    <p><strong>Electronics & Devices:</strong> TV, Laptop, Mouse, Remote, Keyboard, Cell Phone, Microwave, Oven, Toaster, Sink, Refrigerator</p>
                    <p><strong>Miscellaneous Objects:</strong> Book, Clock, Vase, Scissors, Teddy Bear, Hair Dryer, Toothbrush</p>
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
            )
          }
        
        {!aiOn && (
          <div className="space-y-4 bg-white p-8 rounded-md shadow-lg max-w-3xl mx-auto">
            <select
              value={selectedCategoryName}
              onChange={handleCategoryChange}
              required
              className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={"key" + category.categoryId} value={category.categoryid}>
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
                  <option value="">Select a subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.subcategoryId} value={subcategory.subcategoryid}>
                      {subcategory.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <AddPost selectedSubcategory={selectedSubcategory} aiOn={aiOn}/>
      </>
    );
    
    }

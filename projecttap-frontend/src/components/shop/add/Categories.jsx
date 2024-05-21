"use client"
import { request } from "@/app/axios_helper";

import { useState, useEffect } from "react";
import AddPost from "./AddPost";

export default function Categories(){
const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');

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
        <div className="space-y-4 bg-white p-8 rounded-md shadow-lg max-w-lg mx-auto">
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
        <AddPost selectedSubcategory={selectedSubcategory} />
      </>
    );
    
    }

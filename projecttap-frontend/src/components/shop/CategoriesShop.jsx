import axios from "axios";
import { useState, useEffect } from "react";
import ProductsList from "./PostsList";
import { request } from "@/app/axios_helper";

export default function CategoriesShop({ loginInfo }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    const selectedCategoryName = event.target.value;
    const matchedCategory = categories.find(
      (category) => category.title === selectedCategoryName
    );
    setSelectedCategoryName(selectedCategoryName);
    if (matchedCategory) {
      setSelectedCategory(matchedCategory.categoryId);
    }
  };

  const handleSubcategoryChange = (event) => {
    const selectedSubcategoryName = event.target.value;
    const matchedSubcategory = subcategories.find(
      (subcategory) => subcategory.title === selectedSubcategoryName
    );
    setSelectedSubcategoryName(selectedSubcategoryName);
    if (matchedSubcategory) {
      setSelectedSubcategory(matchedSubcategory.subcategoryId);
    }
  };

  const clearFilter = () => {
    setSelectedSubcategory("");
    setSelectedSubcategoryName("");
    setSelectedCategoryName("");
    setSearchQuery("");
    setSubcategories([]);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="mt-3">
        <p className="text-center text-gray-600">Filter by subcategories or search by name</p>
      </div>
      <div className="flex items-center justify-center mb-3 space-x-3">
        <div>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="bg-white border border-gray-300 rounded px-3 py-1 focus:outline-indigo-600"
          />
        </div>
        <select
          value={selectedCategoryName}
          onChange={handleCategoryChange}
          required
          className="block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.title}>
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
              className="block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.subcategoryId} value={subcategory.title}>
                  {subcategory.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 my-4"
          onClick={clearFilter}
        >
          Clear Filters
        </button>
      </div>
      
      <ProductsList
        loginInfo={loginInfo}
        selectedSubcategory={selectedSubcategory}
        searchQuery={searchQuery}
      />
    </>
  );
}

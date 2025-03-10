import { useEffect, useState } from "react";
import { getAuthenticationToken, request } from "@/app/axios_helper";
import { useRouter } from "next/navigation";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function AddPost({ selectedSubcategory, aiOn }) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState();
  const created = Date.now();
  const [currency, setCurrency] = useState('EUR')
  const [status, setStatus] = useState('Used')
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    if (loginInfo) {
      setUserId(loginInfo.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!aiOn){
      try {
        const response = await request("POST", "/posts/add", {
          title: title,
          description: description,
          price: price,
          userId: userId,
          location: location,
          subcategoryId: selectedSubcategory,
          created: created,
          status: status,
          currency: currency
        });
  
        console.log(response.data)
  
        if (response.data) {
          const postId = response.data;
          for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('postId', postId);
  
            const photoResponse = await fetch(`http://localhost:8080/photos/add/post`, {
              method: 'POST',
              body: formData
            });
  
            if (photoResponse.ok) {
              console.log('Image added successfully');
            } else {
              console.error('Failed to add image');
            }
          }
          alert("Product added successfully");
          setFiles([]);
          setPreviewImages([]);
          setTitle("")
          setDescription("")
          setPrice("")
          setLocation("")
          router.push(`/posts/${postId}`);
        }
      } catch (error) {
        console.error('Error adding post and images:', error);
      }
    }else{
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      formData.append("status", status);
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("location", location);

      try {
        const response = await fetch("http://127.0.0.1:8000/predict/", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Prediction Result:", result);
      } catch (error) {
        console.error("Error uploading file(s):", error);
      }
    };
  }

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    setFiles(selectedFilesArray);

    const previews = [];
    selectedFilesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === selectedFilesArray.length) {
          setPreviewImages(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {previewImages.length === 1 ? (
            <div className="mb-4 flex justify-center">
              <img
                src={previewImages[0]}
                alt={`Preview 0`}
                className="mb-2 rounded-lg shadow-lg"
                style={{ maxWidth: '100%', maxHeight: '20%' }}
              />
            </div>
          ) : (
            <div className="overflow-hidden flex justify-center items-center px-10 bg-black">
            <Slider className="w-full"> 
              {previewImages.map((preview, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="rounded-lg shadow-lg"
                    style={{ maxWidth: '100%', maxHeight: '20%' }}
                  />
                </div>
              ))}
            </Slider>
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
              required
              onChange={handleFileChange}
              multiple
            />
          </div>
  
          {!aiOn && (
            <div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                id="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            </div>
          )}
  
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status:</label>
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
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
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency:</label>
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
  
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location:</label>
            <input
              required
              type="text"
              id="location"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-600"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
  
          <div className="flex justify-end">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
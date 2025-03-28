import { useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function PreviewAndAddImages({ typeOfAdd = "", setFiles, setPreviewImages, previewImages, set }) {
  const [isPhotoSelected, setisPhotoSelected] = useState(false)

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)
    setFiles(selectedFilesArray)

    const previews = []
    selectedFilesArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result)
        if (previews.length === selectedFilesArray.length) {
          setPreviewImages(previews)
          setisPhotoSelected(true)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      {typeOfAdd === "multiple" ? (
        <>
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
        </>
      ) : (
        <>
          {isPhotoSelected && (
            <div className="flex flex-wrap justify-center gap-0">
              <div className="mb-4 relative flex items-center justify-center w-96 h-96">
                <img src={previewImages[0]} alt={`Preview 0`} className="rounded-lg shadow-lg max-w-full max-h-full object-center" />
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-lg pointer-events-none"
                  style={{
                    WebkitMask: "radial-gradient(circle 390px at center, transparent 40%, black 41%)",
                    mask: "radial-gradient(circle 390px at center, transparent 40%, black 41%)",
                  }}
                ></div>
                <div className="absolute w-80 h-80 rounded-full border-4 border-white"></div>
              </div>
            </div>
          )}
        </>
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
          multiple={typeOfAdd === "multiple"}
        />
      </div>
    </>
  )
}

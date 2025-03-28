import { useState, useEffect } from "react"
import { getAuthenticationToken, request } from "@/app/axios_helper"
import Header from "../Header"
import Loading from "../Loading"
import PreviewAndAddImages from "@/components/PreviewAndAddImages"

export default function EditUser({ user }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  //for file
  const [files, setFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  const [addNewProfilePicture, setAddNewProfilePicture] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setUsername(user.username || "")
      setEmail(user.email || "")
      setPhoneNumber(user.phoneNumber || "")
      setIsLoading(false) // Set loading to false once component is fully loaded
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const token = getAuthenticationToken()

    try {
      let photoId = user.photo_id

      if (addNewProfilePicture && files.length > 0) {
        if (user.photo_id) {
          try {
            await request("DELETE", `/photos/delete/${user.photo_id}`)
            console.log("Old profile photo deleted successfully.")
          } catch (error) {
            console.error("Error deleting old profile photo:", error)
          }
        }

        const formData = new FormData()
        formData.append("image", files[0])

        const photoResponse = await fetch("http://localhost:8080/photos/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!photoResponse.ok) {
          throw new Error("Failed to upload new profile photo")
        }

        const result = await photoResponse.json()
        console.log("New photo uploaded:", result)
        user.photo_id = result
        photoId = result
      }

      await request("PUT", `/users/edit/${user.id}/${photoId}`, {
        firstName,
        lastName,
        email,
        username,
        login: username,
        phoneNumber,
      })

      console.log("User updated!")
      window.location.reload()
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    )
  }

  return (
    <>
      <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-4 px-4 my-3" onClick={() => (window.location.href = `/users/${user.id}`)}>
        Go back
      </button>

      <div className="mb-10 mx-4 sm:mx-auto mt-5 sm:w-full sm:max-w-sm">
        <form className="space-y-6 mb-10" onSubmit={handleSubmit}>
          {user.photo_id != null && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl">Current Profile Picture</h2>
              <img src={`http://localhost:8080/photos/display/${user.photo_id}`} alt="User Profile" className="w-32 h-32 rounded-full mt-2 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input type="checkbox" id="addProfilePic" checked={addNewProfilePicture} onChange={() => setAddNewProfilePicture(!addNewProfilePicture)} className="w-5 h-5" />
            <label htmlFor="addProfilePic" className="text-md">
              Add a new profile picture
            </label>
          </div>

          {addNewProfilePicture && (
            <>
              <h2 className="text-xl">{`Choose your profile picture (The best format would be a square photo)`}</h2>
              <PreviewAndAddImages typeOfAdd={"single"} setFiles={setFiles} setPreviewImages={setPreviewImages} previewImages={previewImages} />
            </>
          )}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              First Name
            </label>
            <div className="mt-1">
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              Last Name
            </label>
            <div className="mt-1">
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-600 dark:text-slate-200">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter your desired username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly // Add readOnly attribute here
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                required
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 text-left shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div> */}

          <div className="mb-4">
            <button
              type="submit"
              className="mb-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-10"
            >
              Update my account
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

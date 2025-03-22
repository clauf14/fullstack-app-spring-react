import { useState, useEffect } from "react"
import { MdLogout } from "react-icons/md"
import { useRouter } from "next/navigation"
import Loading from "../../components/Loading"
import ShowProfilePicture from "../ShowProfilePicture"

export default function UserInfo({ user, params }) {
  //const [showPassword, setShowPassword] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
      if (loginInfo && String(loginInfo.id) === String(params.userId)) {
        setIsCurrentUser(true)
      } else {
        setIsCurrentUser(false)
      }
      setLoading(false)
    }, 500)
  }, [params.userId])

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout? You will have to sign in again after.")) {
      localStorage.removeItem("loginInfo")
      localStorage.removeItem("auth_token")
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="my-20">
        <Loading />
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl mx-28">
      <div className="px-6 py-4 flex items-center space-x-4">
        <ShowProfilePicture user={user} />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">{user.username}</p>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="text-gray-700 text-base">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>
          {isCurrentUser && (
            <>
              <p>
                <strong>Login:</strong> {user.login}
              </p>
              {/* <p>
                <strong>Password:</strong> {showPassword ? user.password : "********"}
                <button
                  onClick={togglePasswordVisibility}
                  className="ml-3 text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </p> */}
              <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full mt-4 mb-2 py-2 px-4" onClick={logout}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <MdLogout style={{ fontSize: "1.5em", marginRight: "7px" }} />
                  Logout
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

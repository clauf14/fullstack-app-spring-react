import { useState, useEffect } from "react"
import { removeAuthenticationToken, request, setAuthenticationToken } from "@/app/axios_helper"
import { useRouter, useSearchParams } from "next/navigation" // Use Next.js routing
import ChangeTheme from "./ChangeTheme"
import HeaderHomepage from "../HeaderHomepage"

export default function LoginForm() {
  const currentDate = new Date()
  const [message, setMessage] = useState("")
  const [tokenMessage, setTokenMessage] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams() // For handling query params

  useEffect(() => {
    const errorMessage = searchParams.get("message")
    if (errorMessage) {
      setTokenMessage(errorMessage)
    }
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.localStorage.getItem("auth_token") != null) {
      removeAuthenticationToken()
    }
    request("POST", "/login", { login: username, password: password })
      .then((response) => {
        setAuthenticationToken(response.data.token)
        setMessage(`User logged in successfully`)

        localStorage.setItem("loginInfo", JSON.stringify(response.data))
        console.log("saved to local storage")

        router.push("/shop")
      })
      .catch((error) => {
        console.error("Error logging in user:", error)
        setMessage("Error logging in user. Please try again.")
      })
  }

  return (
    <>
      <HeaderHomepage />
      <div className="dark:bg-slate-800 flex flex-col justify-center px-6 py-6 lg:px-8">
        <ChangeTheme />

        <div>
          <h1 className="text-red-500 text-bold text-xl">{tokenMessage}</h1>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <svg
            className="mx-auto h-14 w-auto"
            fill="#ffffff"
            width="64px"
            height="64px"
            viewBox="-3.2 -3.2 38.40 38.40"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            strokeWidth="0.00032"
            transform="matrix(-1, 0, 0, 1, 0, 0)"
          >
            {/* SVG Content */}
          </svg>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-slate-200">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500  dark:text-slate-300">
            Not a member?{" "}
            <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register here for free!
            </a>
          </p>

          <p className="text-center text-gray-500 text-xs dark:text-slate-300">&copy;2023-{currentDate.getFullYear()} ClauF Development. All rights reserved.</p>

          <div className="mt-4 flex items-center justify-center">
            <a className={message.includes("Error") ? "text-red-500" : "text-green-500"} href="http://localhost:8080/users">
              {message}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState, useEffect } from "react";
import { request } from "@/app/axios_helper";
import Header from "../Header";
import Loading from "../Loading";

export default function EditUser( {user} ){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setUsername(user.username || "");
          setEmail(user.email || "");
          setPhoneNumber(user.phoneNumber || "");
          setIsLoading(false); // Set loading to false once component is fully loaded
        }
      }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        request("PUT", `/users/edit/${user.id}`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          login: username,
          phoneNumber: phoneNumber,
        })
          .then((response) => {
            alert("User updated successfully!")
            console.log("User updated!");
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };
    

      if (isLoading) {
        return <>
            <Loading/>
        </>
      }

      
    return<>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-4 px-4 my-3"
            onClick={() => window.location.href = `/users/${user.id}`}
        >
            Go back
        </button>
    
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                    First Name
                  </label>
                  <div className='mt-1'>
                  <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Enter your first name" 
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                    Last Name
                  </label>
                  <div className='mt-1'>
                  <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-600 dark:text-slate-200">
                        Username
                    </label>
                    <div className='mt-1'>
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
                  <div className='mt-1'>
                  <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      required
                      placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200" >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
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
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Update your account
                  </button>
                </div>
              </form>
            </div>
    </>
}
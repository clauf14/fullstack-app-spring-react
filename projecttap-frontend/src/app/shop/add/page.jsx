"use client"
import Header from "@/components/Header"
import Categories from "@/components/shop/add/Categories"
import withAuth from "@/app/withAuth"

export default withAuth(function Page() {
  return (
    <>
      <Header />
      <a href={`/shop`}>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 my-2 mx-4 md:mx-28">Go back</button>
      </a>
      <Categories />
    </>
  )
})

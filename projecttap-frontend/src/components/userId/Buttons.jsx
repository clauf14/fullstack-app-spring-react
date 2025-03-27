export default function Buttons({ params, isUserMatched }) {
  return (
    <>
      {/* mx-4 md:mx-28 */}
      <a href="/shop">
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 ml-4 md:ml-28 mr-4 px-4 my-5">Go back to shop</button>
      </a>
      {isUserMatched && (
        <a href={`/users/${params.userId}/edit/`}>
          <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 my-5">Edit my account</button>
        </a>
      )}
    </>
  )
}

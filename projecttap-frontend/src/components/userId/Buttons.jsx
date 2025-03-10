export default function Buttons({ params, isUserMatched}) {
    return (
        <>
            <a href="/shop">
                <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 ml-28 mr-5 px-4 my-5">
                    Go back to shop
                </button>
            </a>

            {isUserMatched && (
                <a href={`/users/${params.userId}/edit/`}>
                    <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-5 px-4 my-5">
                        Edit my account
                    </button>
                </a>
            )}
        </>
    );
}

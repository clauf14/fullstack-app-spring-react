import { request } from "@/app/axios_helper";
import { useEffect, useState } from "react";
import Loading from "../Loading";

export default function PostsListForUser({ posts, isUserMatched }) {
    const [isLoading, setIsLoading] = useState(true);
    const [postsWithLocation, setPostsWithLocation] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!posts || posts.length === 0) {
                setIsLoading(false);
                return;
            }

            const updatedPosts = await Promise.all(
                posts.map(async (post) => {
                    try {
                        const response = await request("GET", `/location/${post.locationId}`);
                        return { ...post, location: response.data.name };
                    } catch (error) {
                        console.error(`Error fetching location for post ${post.postId}:`, error);
                        return { ...post, location: "Unknown location" };
                    }
                })
            );

            setPostsWithLocation(updatedPosts);
            setIsLoading(false);
        };

        fetchLocations();
    }, [posts]);

    const deletePost = async (e, postId, locationId) => {
        e.preventDefault();
        const userConfirmed = window.confirm("Are you sure you want to delete this post?");
        if (!userConfirmed) return;

        try {
            await request("DELETE", `/posts/delete/${postId}/${locationId}`);
            alert("The post has been deleted!");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <div>
                {isLoading ? (
                    <div className="my-36">
                        <Loading />
                    </div>
                ) : postsWithLocation.length !== 0 ? (
                    postsWithLocation.map((post) => (
                        <div key={post.postId} className="mb-6 mt-6 mx-28 bg-white shadow-md rounded-lg flex p-5">
                            <div className="flex-1">
                                <h1 className="text-lg font-bold mb-4">{post.title}</h1>
                                <p className="text-gray-500">Post ID: {post.postId}</p>
                                <p className="text-gray-500">Location: {post.location}</p> {/* Updated location */}
                                <p className="text-gray-500">Created: {new Date(post.created).toLocaleString()}</p>
                                <p className="text-gray-500">Price: {post.price} {post.currency}</p>
                                <p className="text-gray-500">Status: {post.status}</p>
                                <p className="text-gray-500 mb-4">Subcategory ID: {post.subcategoryId}</p>
                                <div className="flex space-x-3 mt-3">
                                    <button
                                        className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4"
                                        onClick={() => window.location.href = `/posts/${post.postId}`}
                                    >
                                        View post
                                    </button>
                                    {isUserMatched && (
                                        <>
                                            <button
                                                className="bg-green-600 hover:bg-green-800 text-white font-bold rounded-full py-2 px-4"
                                                onClick={() => window.location.href = `/posts/${post.postId}/edit`}
                                            >
                                                Edit post
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full py-2 px-4"
                                                onClick={(e) => deletePost(e, post.postId, post.locationId)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 w-60 h-60 flex-shrink-0">
                                <img
                                    src={post.photos.length > 0 ? `http://localhost:8080/photos/display/${post.photos[0].photoId}` : 'https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg'}
                                    alt="Post Image"
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-3xl font-extrabold">You do not have any posts associated with your profile</p>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 px-4 my-6"
                            onClick={() => window.location.href = '/shop/add'}
                        >
                            Add a post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
